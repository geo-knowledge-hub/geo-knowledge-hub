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
from invenio_app_rdm.records_ui.views.decorators import pass_record

from .config import GEO_KNOWLEDGE_HUB_EXT_INFORMATION_REQUIRED_IN_METADATA_BY_SCHEME as metadata_field_by_scheme


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
        metadata_field: _config.get(
            metadata_field_for_scheme[metadata_field]
        ) for metadata_field in metadata_field_for_scheme.keys()
    }


def _get_doi_metadata(identifier_doi) -> Dict:
    """DOI Metadata Retriever
    """
    from crossref.restful import Works

    works_obj = Works()
    metadata = works_obj.doi(identifier_doi)

    return _metadata_builder(metadata, scheme="doi")


def _get_url_metadata(identifier_url) -> Dict:
    """InvenioRDM Internal Metadata Retriever

    See: This is a temporary function that uses a InvenioRDM as a identifier to retrieve
    metadata. In the future, this will be change to use only DOI
    """

    @pass_record
    def record_object_by_id(record=None, pid_value=None):
        return record

    pid_value = identifier_url.rsplit('/', 1)[-1]
    record = record_object_by_id(pid_value=pid_value)

    return _metadata_builder(record.to_dict(), scheme="url")


METADATA_SERVICE = {
    "doi": _get_doi_metadata,
    "url": _get_url_metadata
}


def get_related_resource_information(related_resource_document: Dict):
    """Service to retrieve Metadata from a Related Resource Document

    Args:
        related_resource_document (dict): Related Resource basic metadata
        (This is the same document used in the InvenioRDM Record Document)
    Returns:
        Dict: Returns a dict the retrieved metadata
    """

    return METADATA_SERVICE[
        related_resource_document["scheme"]
    ](related_resource_document["identifier"])
