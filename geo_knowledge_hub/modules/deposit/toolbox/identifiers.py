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
from flask import current_app


def related_identifiers_url_by_scheme(related_identifiers: List[Dict]) -> List[Dict]:
    """Create related identifiers URL by scheme.

    Args:
        related_identifiers (List[Dict]): List of record related identifiers

    Returns:
        List[Dict]: List of record related identifiers (with URL resolved)
    """
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
                    doi_prefix = current_app.config.get("RDM_RECORDS_DOI_DATACITE_PREFIX", None)

                    if doi_prefix and identifier_split[0] == doi_prefix:
                        related_identifier_obj["url"] = posixpath.join("/records", identifier_split[1])

                if not related_identifier_obj["url"]:
                    related_identifier_obj["url"] = idutils.to_url(identifier, scheme, "https")
        except:
            related_identifier_obj["url"] = identifier
        new_related_identifiers.append(related_identifier_obj)
    return new_related_identifiers


__all__ = (
    "related_identifiers_url_by_scheme"
)
