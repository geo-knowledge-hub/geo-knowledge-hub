# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Identifiers helpers."""

import idutils
import posixpath

from pydash import py_

from typing import Dict, List

from invenio_records import Record


def get_related_identifiers_url(record: Record, doi_prefix: str) -> List[Dict]:
    """Create related identifiers URL.

    Args:
        related_identifiers (Record): Record API Object from where the related
        identifiers will be extracted.

        doi_prefix (str): GEO Knowledge Hub DOI Prefix.

    Returns:
        List[Dict]: List of record related identifiers (with URL resolved)

    Note:
        The `doi_prefix` is used to check if the items are managed by the GEO Knowledge Hub.
    """
    # extracting related identifiers
    related_identifiers = py_.get(record, "metadata.related_identifiers", [])

    new_related_identifiers = []
    for related_identifier in related_identifiers:
        if related_identifier.get("identifier", None):
            pass

        scheme = related_identifier["scheme"]
        identifier = related_identifier["identifier"]

        related_identifier_obj = py_.set_(py_.clone_deep(related_identifier), "url", "")

        try:
            if idutils.is_url(identifier):
                related_identifier_obj["url"] = identifier
            else:
                # checking if the doi is internal
                if idutils.is_doi(identifier):
                    identifier_split = identifier.split("/")

                    if doi_prefix and identifier_split[0] == doi_prefix:
                        related_identifier_obj["url"] = posixpath.join(
                            "/records", identifier_split[1]
                        )

                if not related_identifier_obj["url"]:
                    related_identifier_obj["url"] = idutils.to_url(
                        identifier, scheme, "https"
                    )
        except:
            related_identifier_obj["url"] = identifier
        new_related_identifiers.append(related_identifier_obj)
    return new_related_identifiers


def filter_knowledge_resources_from_related_identifiers_url(
    related_identifiers: List[Dict], knowledge_resource_ids: List[str]
) -> List[Dict]:
    """Remove Knowledge Resources from the Related Identifiers.

    Args:
        related_identifiers (List[Dict]): List of Related Resource Metadata object (as dicts).

        List[str]: List of Knowledge Resources IDs.

    Returns:
        List[Dict]: List of Related Resource Metadata object without Knowledge Resources.

    See:
        For more information about the Related resource object, please, check the InvenioRDM Documentation:
        - https://inveniordm.docs.cern.ch/reference/metadata/#related-identifiersworks-0-n
    """
    return py_.filter(
        related_identifiers,
        lambda x: x["identifier"].split("/")[-1] not in knowledge_resource_ids,
    )


__all__ = (
    "related_identifiers_url_by_scheme",
    "filter_knowledge_resources_from_related_identifiers_url",
)
