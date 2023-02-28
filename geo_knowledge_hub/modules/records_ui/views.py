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
from geo_rdm_records.base.resources.serializers import (
    UIRecordJSONSerializer as UIJSONSerializer,
)
from invenio_app_rdm.records_ui.views.decorators import (
    pass_draft_community,
    pass_is_preview,
)
from invenio_app_rdm.records_ui.views.deposits import get_search_url, new_record

from geo_knowledge_hub.modules.base.config import get_form_config
from geo_knowledge_hub.modules.base.decorators import (
    pass_associated_package,
    pass_draft,
    pass_draft_files,
    pass_is_resource_preview,
    pass_record_files,
    pass_record_or_draft,
)
from geo_knowledge_hub.modules.base.utilities import metadata as metadata_utilities
from geo_knowledge_hub.modules.base.utilities import records as record_utilities
from geo_knowledge_hub.modules.base.utilities import (
    serialization as serialization_utilities,
)


#
# Record Landing page views
#
@pass_is_preview
@pass_is_resource_preview
@pass_record_or_draft(record_type="record", expand=True)
@pass_record_files(record_type="record")
def geo_record_detail(
    record=None,
    files=None,
    pid_value=None,
    is_preview=False,
    navigate=False,
    package=None,
):
    """Record detail page (aka landing page)."""
    # Base definitions
    identity = g.identity

    files_data = None if files is None else files.to_dict()

    record_data = record.to_dict()
    record_ui = UIJSONSerializer().dump_obj(record_data)
    record_ui = serialization_utilities.serialize_related_identifiers_url(record_ui)

    # General record properties
    record_is_draft = record_ui.get("is_draft")

    # Expanding record metadata
    (
        engagement_priorities,
        programme_activity,
        record_tags,
        related_package_metadata,
    ) = metadata_utilities.expand_metadata_from_record(identity, record_ui)

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
        related_elements_information=related_package_metadata,
        related_engagement_priorities=engagement_priorities,
        navigate=navigate,
        package=package,
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
@pass_associated_package
def geo_record_deposit_edit(draft=None, draft_files=None, pid_value=None, package=None):
    """Edit an existing record resource deposit."""
    record = UIJSONSerializer().dump_obj(draft.to_dict())

    if package:
        package = UIJSONSerializer().dump_obj(package.to_dict())

    return render_template(
        "geo_knowledge_hub/records/deposit/index.html",
        forms_config=get_form_config(apiUrl=f"/api/records/{pid_value}/draft"),
        record=record,
        files=draft_files.to_dict(),
        searchbar_config=dict(searchUrl=get_search_url()),
        permissions=draft.has_permissions_to(["new_version"]),
        package=package,
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
