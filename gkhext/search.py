# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Search operations"""

from typing import Dict
from typing import List

from elasticsearch_dsl.query import Q
from invenio_search.api import RecordsSearch
from invenio_search import current_search_client


class FrontpageRecordsSearch(RecordsSearch):
    class Meta:
        index = "rdmrecords-records"
        default_filter = (
            Q("term", **{"access.record": "public"}) &
            Q("term", **{"is_published": True}) &
            Q("term", **{"metadata.resource_type.id": "knowledge"})
        )


def _to_record(query_result) -> List:
    """Elasticsearch result to record
    """
    records = query_result['hits']['hits']

    return [r["_source"] for r in records] if records else []


def search_record_by_doi(identifier_doi: str) -> List[Dict]:
    """Retrieves record using DOI identifier
    Args:
        identifier_doi (str): Record DOI Identifier
    Returns:
        List: List with query results
    """

    return _to_record(current_search_client.search(body={
        "query": {
            "match": {
                "pids.doi.identifier": {
                    "query": identifier_doi,
                    "operator": "and"
                }
            }
        }
    }))
