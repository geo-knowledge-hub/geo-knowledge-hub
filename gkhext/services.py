# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

from typing import Dict

from invenio_app_rdm.records_ui.views.decorators import pass_record


def _get_doi_metadata(identifier_doi):
    """DOI Metadata Retriever
    """
    from crossref.restful import Works

    works_obj = Works()
    metadata = works_obj.doi(identifier_doi)

    return metadata


def _get_url_metadata(identifier_url):
    """InvenioRDM Internal Metadata Retriever

    See: This is a temporary function that uses a InvenioRDM as a identifier to retrieve
    metadata. In the future, this will be change to use only DOI
    """

    @pass_record
    def record_object_by_id(record=None, pid_value=None):
        return record

    pid_value = identifier_url.rsplit('/', 1)[-1]
    record = record_object_by_id(pid_value=pid_value)

    return record.to_dict()["metadata"]


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

    res = METADATA_SERVICE[
        related_resource_document["scheme"]
    ](related_resource_document["identifier"])

    return res
