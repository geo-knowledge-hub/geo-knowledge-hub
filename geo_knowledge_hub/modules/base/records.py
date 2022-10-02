# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Detail (page) record handler."""

from typing import Dict, List, Tuple, Union

from flask import abort, current_app, request, url_for
from flask_principal import Identity
from invenio_app_rdm.records_ui.views.records import PreviewFile
from invenio_base.utils import obj_or_import_string
from invenio_previewer.extensions import default
from invenio_previewer.proxies import current_previewer
from invenio_records.api import Record
from invenio_vocabularies.proxies import current_service as vocabulary_service
from pydash import py_
from sqlalchemy.orm.exc import NoResultFound

from geo_knowledge_hub.modules.base.serializers.ui import UIJSONSerializer

from .registry import get_record_service


def read_record(identity, record_pid, record_type) -> Union[None, Dict]:
    """Read a given record based on it type.

    Args:
        identity (flask_principal.Identity): User identity

        record_pid (str): PID of the record to be read (can be a Draft or a Published Record)

        record_type (str): Type of the record

    Returns:
        Union[None, Dict]: Dict of the record or None
    """
    res = None
    service = get_record_service(record_type)

    try:
        res = service.read(identity, record_pid)

    except NoResultFound:
        res = service.read_draft(identity, record_pid)

    return res.to_dict()


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
    default_scheme = "Engagement Priorities"  # for engagements

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


def serializer_dump_record(record, serializer_cls=UIJSONSerializer):
    """Dump the content of a record using a serializer.

    Args:
        record (Dict): Record to dump.

        serializer_cls (MarshmallowSerializer): Serializer

    Returns:
          Dict: Serialized record.
    """
    serializer = serializer_cls()
    return serializer.dump_obj(record)


def serializer_dump_records(records, serializer_cls=UIJSONSerializer):
    """Dump the content of a list of records using a serializer.

    Args:
        records (List[Dict]): Iterable of records to dump.

        serializer_cls (MarshmallowSerializer): Serializer

    Returns:
        List: List of serialized records.
    """
    return [serializer_dump_record(record, serializer_cls) for record in records]


def extract_extra_record_tags(identity, record):
    """Extract extra GEO tags (e.g., GEO Work programme Activity) from records.

    Args:
        identity (flask_principal.Identity): User identity

        record (invenio_records.api.Record): Record from where data will be extracted.

    Returns:
        Tuple[List]: Tuple with three elements:
            - Position 0: Record Engagement Priorities
            - Position 1: Record Programme Activities
            - Position 2: Record tags (e.g., Engagement Priorities, Target users)
    """
    # Engagement priorities
    related_engagement_priorities = get_engagement_priority_from_record(
        identity, record
    )

    # GEO Work programme activities
    programme_activity = get_programme_activity_from_record(identity, record)

    # Preparing the Subject (including Engagement priorities and target users)
    record_topics = prepare_record_topics(record, related_engagement_priorities)

    return related_engagement_priorities, programme_activity, record_topics


def record_export(pid_value, record, export_format=None):
    """Export page view.

    Note:
        This function was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """
    # Get the configured serializer
    exporter = current_app.config.get("APP_RDM_RECORD_EXPORTERS", {}).get(export_format)
    if exporter is None:
        abort(404)

    serializer = obj_or_import_string(exporter["serializer"])(
        options={
            "indent": 2,
            "sort_keys": True,
        }
    )
    exported_record = serializer.serialize_object(record.to_dict())
    contentType = exporter.get("content-type", export_format)
    filename = exporter.get("filename", export_format).format(id=pid_value)
    headers = {
        "Content-Type": contentType,
        "Content-Disposition": f"attachment; filename={filename}",
    }
    return exported_record, 200, headers


def record_file_preview(
    base_url,
    pid_value,
    record=None,
    pid_type="recid",
    file_metadata=None,
    is_preview=False,
    **kwargs,
):
    """Render a preview of the specified file.

    Note:
        This function was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """
    file_previewer = file_metadata.data.get("previewer")

    url = url_for(
        base_url,
        pid_value=pid_value,
        filename=file_metadata.data["key"],
        preview=1 if is_preview else 0,
    )
    # Find a suitable previewer
    fileobj = PreviewFile(file_metadata, pid_value, url)
    for plugin in current_previewer.iter_previewers(
        previewers=[file_previewer] if file_previewer else None
    ):
        if plugin.can_preview(fileobj):
            return plugin.preview(fileobj)

    return default.preview(fileobj)


def record_file_download(pid_value, file_item=None, is_preview=False, **kwargs):
    """Download a file from a record."""
    download = bool(request.args.get("download"))
    return file_item.send_file(as_attachment=download)
