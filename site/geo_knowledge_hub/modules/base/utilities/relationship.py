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


def get_related_package_metadata(identity, record: Record) -> List:
    """Controller to get metadata from the related record (if defined).

    Args:
        identity (flask_principal.Identity): User identity

        record (Record): Package as Record API Object.

    Returns:
        dict: Loaded metadata
    """
    packages_metadata = []
    record_relationship = record["relationship"]

    if record_relationship:
        packages = record_relationship.get("packages", [])

        for package in packages:
            package_pid = package.get("id")
            package_metadata = read_record(identity, package_pid, "package")

            if package_metadata:
                package_metadata, _ = package_metadata
                package_metadata = package_metadata.to_dict()

                packages_metadata.append(package_metadata)

    return packages_metadata


def get_related_records(record) -> List:
    """Auxiliary function to read the related records from a Package API object.

    Args:
        identity (flask_principal.Identity): User identity

        record (Record): Package as Record API Object.

    Returns:
        List: List with ID of the from related resources
    """
    related_records = []
    record_relationships = record["relationship"]

    for relationship_type in record_relationships.keys():
        record_relations = record_relationships[relationship_type]

        for relationship in record_relations:
            related_records.append(relationship["id"])

    return related_records


def get_related_records_metadata(identity, record: Record) -> List:
    """Controller to get related resources from a record metadata.

    Args:
        identity (flask_principal.Identity): User identity

        record (Record): Package as Record API Object.

    Returns:
        List: List with metadata from related resources
    """
    related_records_metadata = []
    related_record_ids = get_related_records(record)

    for related_record_id in related_record_ids:
        # Packages are only related to "records". So, we need to
        # use the "record" service.
        record_related = read_record(identity, related_record_id, "record")

        if record_related:
            record_related, status = record_related

            record_related = record_related.to_dict()
            record_related["status"] = status

            related_records_metadata.append(record_related)

    return related_records_metadata


def check_related_records_permissions(identity, record: Record, permissions: list):
    """Controller to check the permissions from package resources.

    Args:
        identity (flask_principal.Identity): User identity

        record (Record): Package as Record API Object.

        permissions (List): List of permissions to check

    Returns:
        List: List with metadata from related resources
    """
    related_records_permissions = []
    related_record_ids = get_related_records(record)

    for related_record_id in related_record_ids:
        record_related = read_record(identity, related_record_id, "record")

        if record_related:
            record_related, _ = record_related

            related_records_permissions.append(
                dict(
                    id=record_related.id,
                    permissions=record_related.has_permissions_to(permissions),
                )
            )
    return related_records_permissions
