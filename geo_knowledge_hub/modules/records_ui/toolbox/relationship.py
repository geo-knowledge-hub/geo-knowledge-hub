# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Record relationship module."""

from invenio_records.api import Record

from geo_knowledge_hub.modules.base.records import read_record


def get_related_package_metadata(identity, record: Record) -> dict:
    """Controller to get metadata from the related record (if defined).

    Args:
        identity (flask_principal.Identity): User identity

        record (Record): Package as Record API Object.

    Returns:
        dict: Loaded metadata
    """
    managed_by = None

    record_relationship = record["parent"]
    record_relationship = record_relationship.get("relationship")

    if record_relationship:
        managed_by = record_relationship.get("managed_by", {})
        managed_by_pid = managed_by.get("id")

        if managed_by_pid:
            # "Managed by" at the moment only supports packages. So
            # we need to use the "package" service to load it.
            managed_by = read_record(identity, managed_by_pid, "package")

    return managed_by
