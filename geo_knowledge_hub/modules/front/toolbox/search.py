# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Search operations."""

from typing import Dict, List

from elasticsearch_dsl.query import Q
from invenio_search.api import RecordsSearch

from geo_rdm_records.resources.serializers.ui.serializer import UIJSONSerializer


class LatestKnowledgePackageSearch(RecordsSearch):
    class Meta:
        index = "geordmrecords-records"
        default_filter = (
            Q("term", **{"access.record": "public"})
            & Q("term", **{"is_published": True})
            & Q("term", **{"versions.is_latest": True})
            & Q("term", **{"metadata.resource_type.id": "knowledge"})
        )


def get_latest_knowledge_packages(n: int) -> List[Dict]:
    """Retrieve latest knowledge packages.

    Args:
        n (int): Number of packages retrieved.

    Returns:
        List[Dict]: List of dictionaries with the retrieved records.
    """
    latest_records = LatestKnowledgePackageSearch()[:n].sort("-created").execute()
    return [
        UIJSONSerializer().serialize_object_to_dict(r.to_dict()) for r in latest_records
    ]


__all__ = "get_latest_knowledge_packages"
