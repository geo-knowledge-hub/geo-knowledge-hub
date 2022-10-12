# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Record relationship module."""

from typing import List

from invenio_records.api import Record

from geo_knowledge_hub.modules.base.utilities.records import read_record


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


def get_related_records_metadata(identity, record: Record) -> List:
    """Controller to get related resources from a record metadata.

    Args:
        identity (flask_principal.Identity): User identity

        record (Record): Package as Record API Object.

    Returns:
        List: List with metadata from related resources
    """
    related_records = []
    record_relationships = record["relationship"]

    for relationship_type in record_relationships.keys():

        record_relations = record_relationships[relationship_type]

        for relationship in record_relations:
            record_related_pid = relationship["id"]

            # Packages are only related to "packages". So, we need to
            # use the "record" service.
            record_related = read_record(identity, record_related_pid, "record")
            related_records.append(record_related)

    return related_records
