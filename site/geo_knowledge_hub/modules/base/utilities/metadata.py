# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) Package handler."""

from pydash import py_

from geo_knowledge_hub.modules.base.utilities import records as record_utilities
from geo_knowledge_hub.modules.base.utilities import (
    relationship as relationship_utilities,
)


def expand_metadata_from_package(identity, package):
    """Expand Knowledge Package metadata.

    Args:
        identity (flask_principal.Identity): User identity

        package (dict): Base record metadata.

    Returns:
        dict: record metadata expanded.
    """
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

        # Processing metadata
        related_records_metadata = record_utilities.mask_restricted_records(
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

    return dict(
        record_topics=record_tags,
        related_engagement_priorities=engagement_priorities,
        programme_activity=programme_activity,
        user_stories=user_stories,
        related_elements_information=related_records_metadata,
    )


def expand_metadata_from_record(identity, record):
    """Expand Knowledge Resource (Record) metadata.

    Args:
        identity (flask_principal.Identity): User identity

        record (dict): Base record metadata.

    Returns:
        dict: record metadata expanded.
    """
    # Extract associate package (if defined)
    related_package_metadata = relationship_utilities.get_related_package_metadata(
        identity, record
    )

    related_package_metadata = record_utilities.serializer_dump_records(
        related_package_metadata
    )

    # Extract extra tags (e.g., GEO Work Programme Activity, Target users) from record
    (
        engagement_priorities,
        programme_activity,
        record_tags,
    ) = record_utilities.extract_extra_record_tags(identity, record)

    return dict(
        related_engagement_priorities=engagement_priorities,
        programme_activity=programme_activity,
        record_topics=record_tags,
        related_elements_information=related_package_metadata,
    )


def expand_metadata_from_marketplace_item(identity, record):
    """Expand Marketplace Item metadata.

    Args:
        identity (flask_principal.Identity): User identity

        record (dict): Base record metadata.

    Returns:
        dict: record metadata expanded.
    """
    (
        engagement_priorities,
        programme_activity,
        record_tags,
    ) = record_utilities.extract_extra_record_tags(identity, record)

    launch_url = py_.get(record, "metadata.marketplace.launch_url")
    vendor_contact = py_.get(record, "metadata.marketplace.vendor_contact")

    return dict(
        related_engagement_priorities=engagement_priorities,
        programme_activity=programme_activity,
        record_topics=record_tags,
        marketplace=dict(launch_url=launch_url, vendor_contact=vendor_contact),
    )
