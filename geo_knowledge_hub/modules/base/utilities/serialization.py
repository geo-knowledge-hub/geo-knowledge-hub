# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Serialization utilities functions."""

from invenio_app_rdm.records_ui.views.filters import pid_url
from pydash import py_


def serialize_related_identifiers_url(record):
    """Serialize the Identifier URL in the related identifiers."""
    related_identifiers = py_.get(record, "ui.related_identifiers", [])

    if related_identifiers:
        for related_identifier in related_identifiers:
            scheme = py_.get(related_identifier, "scheme")
            identifier = py_.get(related_identifier, "identifier")

            if identifier and scheme:
                py_.set(related_identifier, "url", pid_url(identifier, scheme) or None)

    py_.set(record, "ui.related_identifiers", related_identifiers)
    return record
