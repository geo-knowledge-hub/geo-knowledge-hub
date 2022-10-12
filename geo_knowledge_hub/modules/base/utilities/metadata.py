# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) Package handler."""

from geo_knowledge_hub.modules.base.utilities import records as record_utilities
from geo_knowledge_hub.modules.base.utilities import (
    relationship as relationship_utilities,
)


def expand_metadata_from_package(identity, package):
    """Expand Knowledge Package metadata."""
    # Expanding associated records (if defined)
    user_stories = []
    related_records_metadata = []

    related_records_metadata = relationship_utilities.get_related_records_metadata(
        identity, package
    )

    if related_records_metadata:
        # If records are associated with the package, we prepare
        # the metadata to be used on the front end and extract which
        # record is a user story.

        # Dump the loaded record
        related_records_metadata = record_utilities.serializer_dump_records(
            related_records_metadata
        )

        # Extract user stories
        related_records_metadata, user_stories = record_utilities.extract_user_stories(
            related_records_metadata
        )

    # Extract extra tags (e.g., GEO Work Programme Activity, Target users) from record
    (
        engagement_priorities,
        programme_activity,
        record_tags,
    ) = record_utilities.extract_extra_record_tags(identity, package)

    return (
        engagement_priorities,
        programme_activity,
        record_tags,
        user_stories,
        related_records_metadata,
    )


def expand_metadata_from_record(identity, record):
    """Expand Knowledge Resource (Record) metadata."""
    # General record properties
    record_parent = record.get("parent")

    record_relationship = record_parent.get("relationship", {})
    record_relationship = record_relationship.get("managed_by")

    # Extract associate package (if defined)
    related_package_metadata = None

    if record_relationship:
        # If record is associated with a package we extract metadata
        related_package_obj = relationship_utilities.get_related_package_metadata(
            identity, record
        )

        related_package_metadata = record_utilities.serializer_dump_record(
            related_package_obj
        )

        # ToDo: At this moment, only one package will be used per record. But,
        #       in next updates we will enable the `related` records (now, only
        #       `managed` record is used (For more details, please check the
        #        GEO RDM Records).
        related_package_metadata = [related_package_metadata]

        # Extract extra tags (e.g., GEO Work Programme Activity, Target users) from record
    (
        engagement_priorities,
        programme_activity,
        record_tags,
    ) = record_utilities.extract_extra_record_tags(identity, record)

    return (
        engagement_priorities,
        programme_activity,
        record_tags,
        related_package_metadata,
    )
