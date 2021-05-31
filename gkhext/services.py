# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

from typing import Dict

import kaptan
from invenio_rdm_records.resources.serializers import UIJSONSerializer

from .config import GEO_KNOWLEDGE_HUB_EXT_INFORMATION_REQUIRED_IN_METADATA_BY_SCHEME as metadata_field_by_scheme
from .search import search_record_by_doi


def _metadata_builder(metadata: Dict, scheme) -> Dict:
    """Generate a standardized metadata for all retrievers used

    Args:
        metadata (Dict): Metadata from related resources
    Returns:
        Dict: Dictionary with standard metadata
    """

    metadata_field_for_scheme = metadata_field_by_scheme.get(scheme)

    _config = kaptan.Kaptan()
    _config.import_config(metadata)

    return {
        **{
            metadata_field: _config.get(
                metadata_field_for_scheme[metadata_field]
            ) for metadata_field in metadata_field_for_scheme.keys()
        },
        "ui": UIJSONSerializer().serialize_object_to_dict(metadata).get("ui")
    }


def _get_doi_metadata(identifier_doi) -> Dict:
    """InvenioRDM Internal Metadata Retriever

    See: This is a temporary function that uses a InvenioRDM as a identifier to retrieve
    metadata. In the future, this will be change to use only DOI
    """

    record_metadata = None
    record = search_record_by_doi(identifier_doi)

    if record:
        record_metadata = _metadata_builder(record[0], scheme="doi")
        record_metadata["url"] = f"/records/{record[0]['id']}"

    return record_metadata


# Strategy pattern:
#   More patterns and behaviors for information retrieval can be added
METADATA_SERVICE = {
    "doi": _get_doi_metadata
}


def get_related_resource_information(related_resource_document: Dict):
    """Service to retrieve Metadata from a Related Resource Document

    Args:
        related_resource_document (dict): Related Resource basic metadata
        (This is the same document used in the InvenioRDM Record Document)
    Returns:
        Dict: Returns a dict the retrieved metadata
    """

    strategy = METADATA_SERVICE.get(related_resource_document["scheme"])

    return None if strategy is None else strategy(related_resource_document["identifier"])
