# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Communities Search (page)."""

from typing import Dict, List

from invenio_communities.proxies import current_communities
from invenio_search.api import RecordsSearch
from invenio_search.engine import dsl
from pydash import py_


class LatestKnowledgePackagesWithCommunitySearch(RecordsSearch):
    """Get the latest updated Knowledge Packages linked to communities."""

    class Meta:
        """Search configuration."""

        index = "geordmpackages-records"

        default_filter = (
            dsl.Q("term", **{"access.record": "public"})
            & dsl.Q("term", **{"is_published": True})
            & dsl.Q("term", **{"versions.is_latest": True})
            & dsl.Q("exists", field="parent.communities.ids")
        )


def get_communities_with_latest_updates(identity, size: int) -> List[Dict]:
    """Retrieve latest knowledge packages.

    Args:
        identity (flask_principal.Identity): Identity.

        size (int): Number of communities to retrieve.

    Returns:
        List[Dict]: List of dictionaries with the retrieved records.
    """
    search = LatestKnowledgePackagesWithCommunitySearch()

    # define aggregations - terms
    communities_aggs = dsl.A(
        name_or_agg="terms",
        field="parent.communities.ids",
        size=size,
        order={"latest_update": "desc"},
    )

    # define aggregations - latest update
    latest_update_agg = dsl.A(name_or_agg="max", field="updated")  # record field

    # define aggregations - top hits
    top_hits_agg = dsl.A(
        name_or_agg="top_hits",
        size=1,
        sort=[{"updated": {"order": "desc"}}],
        _source={"includes": ["parent.communities.ids", "updated"]},
    )

    # add aggregations in the search
    (
        search.aggs.bucket("unique_communities", communities_aggs)
        .metric("latest_update", latest_update_agg)
        .metric("top_hit", top_hits_agg)
    )

    # search result
    search_result = search.execute()
    search_result = (
        py_.chain(search_result)
        .get("aggs.unique_communities.buckets", [])
        .sort(key=lambda x: py_.get(x, "latest_update.value"), reverse=True)
        .map(lambda x: x["key"])
    ).value()

    # get record metadata
    communities_metadata = current_communities.service.read_many(
        identity, search_result
    ).to_dict()

    # create a mapping of the order based on the 'id'
    order_map = {item: index for index, item in enumerate(search_result)}

    # sort communities to highlight communities with latest content available
    communities_items = py_.get(communities_metadata, "hits.hits")
    communities_items = py_.sort_by(communities_items, lambda x: order_map[x["id"]])

    return py_.set(communities_metadata, "hits.hits", communities_items)


__all__ = "get_communities_with_latest_updates"
