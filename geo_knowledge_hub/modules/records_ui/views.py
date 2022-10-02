# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) views."""

from flask import g, render_template
from flask_login import login_required
from geo_config.security.permissions import need_permission
from invenio_app_rdm.records_ui.views.decorators import (
    pass_draft_community,
    pass_is_preview,
)
from invenio_app_rdm.records_ui.views.deposits import get_search_url, new_record

from geo_knowledge_hub.modules.base.serializers.ui import UIJSONSerializer

from geo_knowledge_hub.modules.base.config import get_form_config
from geo_knowledge_hub.modules.base.decorators import (
    pass_draft,
    pass_draft_files,
    pass_record_or_draft,
    pass_record_files,
)

from ..base import records as record_utilities
from .toolbox import relationship as relationship_utilities


#
# Record Landing page views
#
@pass_is_preview
@pass_record_or_draft(record_type="record", expand=True)
@pass_record_files(record_type="record")
def geo_record_detail(record=None, files=None, pid_value=None, is_preview=False):
    """Record detail page (aka landing page)."""
    # Base definitions
    identity = g.identity

    files_data = None if files is None else files.to_dict()

    record_data = record.to_dict()
    record_ui = UIJSONSerializer().dump_obj(record_data)

    # General record properties
    record_is_draft = record_ui.get("is_draft")
    record_parent = record_ui.get("parent")

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
    ) = record_utilities.extract_extra_record_tags(identity, record_ui)

    return render_template(
        "geo_knowledge_hub/details/detail.html",
        # Invenio App RDM template variables
        record=record_ui,
        files=files_data,
        permissions=record.has_permissions_to(
            ["edit", "new_version", "manage", "update_draft", "read_files", "review"]
        ),
        is_draft=record_is_draft,
        is_preview=is_preview,
        # GEO Knowledge Hub template variables
        is_knowledge_package=False,
        record_topics=record_tags,
        programme_activity=programme_activity,
        related_package_information=related_package_metadata,
        related_engagement_priorities=engagement_priorities,
    )


#
# Deposit views
#
@login_required
@need_permission("geo-provider-access")
@pass_draft_community
def geo_record_deposit_create(community=None):
    """Deposit page to create resources."""
    return render_template(
        "geo_knowledge_hub/records/deposit/index.html",
        forms_config=get_form_config(createUrl=("/api/records")),
        searchbar_config=dict(searchUrl=get_search_url()),
        record=new_record(),
        files=dict(default_preview=None, entries=[], links={}),
        preselectedCommunity=community,
    )


@login_required
@need_permission("geo-provider-access")
@pass_draft(record_type="record", expand=True)
@pass_draft_files(record_type="record")
def geo_record_deposit_edit(draft=None, draft_files=None, pid_value=None):
    """Edit an existing record resource deposit."""
    record = UIJSONSerializer().dump_obj(draft.to_dict())

    return render_template(
        "geo_knowledge_hub/records/deposit/index.html",
        forms_config=get_form_config(apiUrl=f"/api/records/{pid_value}/draft"),
        record=record,
        files=draft_files.to_dict(),
        searchbar_config=dict(searchUrl=get_search_url()),
        permissions=draft.has_permissions_to(["new_version"]),
    )


#
# Export views
#
@pass_is_preview
@pass_record_or_draft("record", expand=False)
def record_export(
    pid_value, record, export_format=None, permissions=None, is_preview=False
):
    """Export page view."""
    return record_utilities.record_export(pid_value, record, export_format)
