# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Detail (page) search definition."""

from typing import Dict, List, Union

from geo_rdm_records.resources.serializers.ui.serializer import UIJSONSerializer
from invenio_records.api import Record
from invenio_search import current_search_client
from pydash import py_

from geo_knowledge_hub.config import (
    GEO_KNOWLEDGE_HUB_EXT_INFORMATION_REQUIRED_IN_METADATA_BY_SCHEME as metadata_field_by_scheme,  # ToDo: Use the `current_app` configuration instance
)


def _to_record(query_result) -> List:
    """Elasticsearch result to record."""
    records = query_result["hits"]["hits"]

    return [r["_source"] for r in records] if records else []


def _metadata_builder(metadata: Dict, scheme) -> Dict:
    """Generate a standardized metadata for all retrievers used.

    Args:
        metadata (Dict): Metadata from related resources

    Returns:
        Dict: Dictionary with standard metadata
    """
    # ToDo: Change the nomenclature and use the idea of serializers here.
    metadata_field_for_scheme = metadata_field_by_scheme.get(scheme)

    return {
        **{
            metadata_field: py_.get(
                metadata, metadata_field_for_scheme[metadata_field], ""
            )
            for metadata_field in metadata_field_for_scheme.keys()
        },
        "ui": UIJSONSerializer().serialize_object_to_dict(metadata).get("ui"),
    }


def _get_doi_metadata(identifier_doi) -> Dict:
    """Metadata Retriever function.

    See: This is a temporary function that uses a InvenioRDM as a identifier to retrieve
    metadata. In the future, this will be change to use only DOI
    """
    record_metadata = None
    record = search_record_by_doi(identifier_doi)

    if record:
        record_metadata = _metadata_builder(record[-1], scheme="doi")
        record_metadata["url"] = f"/records/{record[-1]['id']}"

    return record_metadata


def search_record_by_doi(identifier_doi: str) -> List[Dict]:
    """Retrieves record using DOI identifier.

    Args:
        identifier_doi (str): Record DOI Identifier

    Returns:
        List[Dict]: List with query results
    """
    # FIXME: Review query permissions here.
    return _to_record(
        current_search_client.search(
            body={
                "query": {
                    "match": {
                        "pids.doi.identifier": {
                            "query": identifier_doi,
                            "operator": "and",
                        }
                    }
                }
            }
        )
    )


def get_related_resource_metadata(related_resource_document: Dict) -> Union[None, Dict]:
    """Service to retrieve Metadata from a Related Resource Document.

    Args:
        related_resource_document (dict): Related Resource basic metadata
        (This is the same document used in the InvenioRDM Record Document)
    Returns:
        Union[None, Dict]: None or Dict the retrieved metadata
    """
    scheme = related_resource_document.get("scheme")
    if scheme == "doi":
        return _get_doi_metadata(related_resource_document["identifier"])

    return None


def get_related_resources_metadata(record: Record) -> List:
    """Controller to get related resources from a record metadata.

    Args:
        record (Record): Record API Object.

    Returns:
        List: List with metadata from related resources
    """
    record_metadata = record["metadata"]

    if "related_identifiers" not in record_metadata:
        return []

    related_resources_metadata = []
    related_identifiers = record_metadata["related_identifiers"]

    for related_record in related_identifiers:
        record_details = get_related_resource_metadata(related_record)
        related_resources_metadata.append(record_details)

    return py_.filter(related_resources_metadata, lambda x: x is not None)


__all__ = (
    "search_record_by_doi",
    "get_related_resource_metadata",
    "get_related_resources_metadata",
)
