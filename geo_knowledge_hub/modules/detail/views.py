# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_
from flask import current_app, render_template, g

from invenio_app_rdm.records_ui.views.decorators import (
    pass_is_preview,
    pass_record_files,
    pass_record_or_draft,
)

from geo_rdm_records.resources.serializers.ui.serializer import UIJSONSerializer

from geo_knowledge_hub.modules.detail.toolbox.record import (
    extract_user_stories,
    prepare_record_topics,
    get_programme_activity_from_record,
    get_engagement_priority_from_record,
)

from geo_knowledge_hub.modules.detail.toolbox.search import (
    get_related_resources_metadata,
)

from geo_knowledge_hub.modules.detail.toolbox.identifiers import (
    filter_knowledge_resources_from_related_identifiers_url,
    get_related_identifiers_url,
)


@pass_is_preview
@pass_record_or_draft
@pass_record_files
def geo_record_detail(record=None, files=None, pid_value=None, is_preview=False):
    """Record detail page (aka landing page)."""
    # Base definitions
    files_data = None if files is None else files.to_dict()

    record_data = record.to_dict()
    record_ui = UIJSONSerializer().serialize_object_to_dict(record_data)

    # General record properties
    record_is_draft = record_ui.get("is_draft")

    # Start - Temporary block: Block to build the Knowledge Package and Knowledge Resource Context
    #                          into the Record Landing page. This block will be replaced with the
    #                          Knowledge Package Context API when it is implemented.
    #                          Note: We use functions in order to organize the package building workflow.

    # Related records
    all_related_records_informations = get_related_resources_metadata(record)

    # Extract user stories
    related_records_informations, user_stories = extract_user_stories(
        all_related_records_informations
    )

    # Identifiers
    related_identifiers = get_related_identifiers_url(
        record,
        doi_prefix=current_app.config.get("DATACITE_PREFIX", None),
    )

    # Removing all related resource that is a knowledge resource
    related_identifiers = filter_knowledge_resources_from_related_identifiers_url(
        related_identifiers,
        py_.map(
            all_related_records_informations,
            lambda y: y["id"],
        ),
    )

    # Engagement priorities
    related_engagement_priorities = get_engagement_priority_from_record(
        g.identity, record
    )

    # GEO Work programme activities
    programme_activity = get_programme_activity_from_record(g.identity, record)

    # Preparing the Subject (including Engagement priorities and target users)
    record_topics = prepare_record_topics(record_ui, related_engagement_priorities)

    # End - Temporary block

    return render_template(
        "geo_knowledge_hub/records/detail.html",
        pid=pid_value,
        record=record_ui,
        files=files_data,
        is_draft=record_is_draft,
        is_preview=is_preview,
        related_identifiers=related_identifiers,
        user_stories=user_stories,
        record_topics=record_topics,
        programme_activity=programme_activity,
        related_records_informations=related_records_informations,
        related_engagement_priorities=related_engagement_priorities,
        permissions=record.has_permissions_to(
            ["edit", "new_version", "manage", "update_draft", "read_files"]
        ),
    )
