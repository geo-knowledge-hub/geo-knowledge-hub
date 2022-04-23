# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Detail (page) record handler."""

from typing import Dict, List, Tuple, Union

from flask import url_for
from flask_principal import Identity
from invenio_records.api import Record
from invenio_vocabularies.proxies import current_service as vocabulary_service
from pydash import py_


def get_engagement_priority_from_record(
    identity: Identity, record: Record
) -> Union[None, List[Dict]]:
    """Retrieve the Engagement Priority metadata associated with a record.

    Args:
        identity (flask_principal.Identity): User identity

        record (invenio_records.Record): Record API Object from where the engagement
                                         priorities must be extracted.

    Returns:
        Union[None, List[Dict]]: None or the engagement priorities metadata (as dict).
    """
    # getting the engagement priority topics
    result = None

    record_engagement_priorities = py_.get(record, "metadata.engagement_priorities", [])
    record_engagement_priorities_ids = py_.map(
        record_engagement_priorities, lambda x: x["id"]
    )

    if record_engagement_priorities_ids:
        record_engagement_priorities = vocabulary_service.read_many(
            identity=identity,
            type="engagementprioritiestypes",
            ids=record_engagement_priorities_ids,
        ).to_dict()

        result = (
            py_.chain(record_engagement_priorities)
            .get("hits.hits", [])
            .map(
                lambda x: py_.set_(
                    x,
                    "props.icon",
                    url_for("static", filename=py_.get(x, "props.icon")),
                )
                if py_.get(x, "props.icon") != ""
                else x,
            )
        ).value()
    return result


def get_programme_activity_from_record(
    identity: Identity, record: Record, programme_vocabulary: str = "geowptypes"
) -> Union[None, Dict]:
    """Retrieve the GEO Work Programme activity metadata associated with the record.

    Args:
        identity (flask_principal.Identity): User identity

        record (invenio_records.Record): Record API Object from where the GEO Work Programme activity must be
                                         extracted.

        programme_vocabulary (str): Vocabulary used to search the programme metadata.

    Returns:
        Union[None, Dict]: None or the GEO Work Programme metadata (as dict).
    """
    result = None

    # extracting the geo work programme activity metadata
    activity_id = py_.get(record, "metadata.geo_work_programme_activity.id", None)

    if activity_id:
        result = vocabulary_service.read(
            identity, (programme_vocabulary, activity_id)
        ).to_dict()

    return result


def extract_user_stories(
    related_identifiers: List[Dict], user_story_typeid="user-story"
) -> Tuple[Union[None, List], Union[None, List]]:
    """Extract the user stories from a record.

    Args:
        related_identifiers (List[Dict]): List with Relation Object.

        user_story_typeid (str): Resource Type ID of the user-story records.

    Returns:
        Tuple[Union[None, List], Union[None, List]]: Tuple with the following content:
            - First tuple position: Related identifiers that are not user stories
            - Second tuple position: User Stories identifiers.

    See:
        For more information about the Relation Object, please, check the `related-identifiers`
        page available on InvenioRDM Documentation:
        - https://inveniordm.docs.cern.ch/reference/metadata/#related-identifiersworks-0-n
    """
    return py_.partition(
        related_identifiers,
        lambda x: py_.get(x, "ui.resource_type.id") != user_story_typeid,
    )


def prepare_record_topics(
    record: Dict, record_engagement_priorities_metadata: List[Dict]
) -> List:
    """Prepare the record topics (Engagement priorities and target users) to use into the UI.

    Note:
        In the created topics list, we only include the engagement priorities without
        icon, since these items are presented in a image carousel.

    Args:
        record (Dict): Record Object serialized as UI Dict.

        record_engagement_priorities_metadata (List[Dict]): List of engagement priorities
                                                            metadata object (as dict).
    Returns:
        List: List with the topics associated with the record
    """
    # preparing the engagement priorities topics
    default_scheme = "Engagement Topics"  # for engagements

    # getting the engagement objects with titles l10n
    engagement_titles_l10n = py_.get(record, "ui.engagement_priorities", [])

    # indexing the l10n objects
    engagement_titles_l10n = {x["id"]: x for x in engagement_titles_l10n}

    record_engagement_priorities = (
        py_.chain(record_engagement_priorities_metadata)
        .filter(lambda x: py_.get(x, "props.icon") == "")
        .map(
            lambda x: {
                "scheme": default_scheme,
                "title": engagement_titles_l10n[x["id"]]["title_l10n"],
                "model_field": "metadata.engagement_priorities",
            }
        )
    ).value()

    # preparing the target users topics
    default_scheme = "Target Audience"  # for users

    # getting the target audience with titles l10n
    target_audiences = (
        py_.chain(record)
        .get("ui.target_audiences", [])
        .map(
            lambda x: {
                "scheme": default_scheme,
                "title": x["title_l10n"],
                "model_field": "metadata.target_audiences",
            }
        )
    ).value()

    return py_.mapcat([target_audiences, record_engagement_priorities])
