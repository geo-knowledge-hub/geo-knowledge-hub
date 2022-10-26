# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Front (page) search definition."""

from typing import Dict, List

from elasticsearch_dsl.query import Q
from geo_rdm_records.base.resources.serializers import (
    UIRecordJSONSerializer as UIJSONSerializer,
)
from invenio_search.api import RecordsSearch


class LatestKnowledgePackageSearch(RecordsSearch):
    """Latest Knowledge Package Search definition class."""

    class Meta:
        """Search definition."""

        index = "geordmpackages-records"
        default_filter = (
            Q("term", **{"access.record": "public"})
            & Q("term", **{"is_published": True})
            & Q("term", **{"versions.is_latest": True})
        )


def get_latest_knowledge_packages(n: int) -> List[Dict]:
    """Retrieve latest knowledge packages.

    Args:
        n (int): Number of packages retrieved.

    Returns:
        List[Dict]: List of dictionaries with the retrieved records.
    """
    latest_records = LatestKnowledgePackageSearch()[:n].sort("-created").execute()
    return [UIJSONSerializer().dump_obj(r.to_dict()) for r in latest_records]


__all__ = "get_latest_knowledge_packages"
