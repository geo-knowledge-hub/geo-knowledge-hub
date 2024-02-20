# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2024 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Marketplace (page) views."""

from flask import g, render_template
from flask_login import login_required
from geo_rdm_records.base.resources.serializers import (
    UIRecordJSONSerializer as UIJSONSerializer,
)
from geo_rdm_records.modules.security.permissions import need_permission
from invenio_app_rdm.records_ui.views.decorators import (
    pass_draft_community,
    pass_is_preview,
)
from invenio_app_rdm.records_ui.views.deposits import get_search_url, new_record

from geo_knowledge_hub.modules.base.config import get_form_config
from geo_knowledge_hub.modules.base.decorators import (
    pass_draft,
    pass_draft_files,
    pass_record_files,
    pass_record_or_draft,
)
from geo_knowledge_hub.modules.base.utilities import records as record_utilities
from geo_knowledge_hub.modules.base.utilities import (
    serialization as serialization_utilities,
)


#
# Deposit views
#
@login_required
@need_permission("geo-provider-access")
@pass_draft_community
def geo_marketplace_item_create(community=None):
    """Deposit page to create resources."""
    return render_template(
        "geo_knowledge_hub/marketplace/deposit/index.html",
        forms_config=get_form_config(createUrl=("/api/marketplace/items")),
        searchbar_config=dict(searchUrl=get_search_url()),
        record=new_record(),
        files=dict(default_preview=None, entries=[], links={}),
        preselectedCommunity=community,
    )


@login_required
@need_permission("geo-provider-access")
@pass_draft(record_type="marketplace-item", expand=True)
@pass_draft_files(record_type="marketplace-item")
def geo_marketplace_item_edit(
    draft=None, draft_files=None, pid_value=None
):
    """Edit an existing record resource deposit."""
    record = UIJSONSerializer().dump_obj(draft.to_dict())

    return render_template(
        "geo_knowledge_hub/marketplace/deposit/index.html",
        forms_config=get_form_config(
            apiUrl=f"/api/marketplace/items/{pid_value}/draft"
        ),
        record=record,
        files=draft_files.to_dict(),
        searchbar_config=dict(searchUrl=get_search_url()),
        permissions=draft.has_permissions_to(["new_version"])
    )


#
# Record Landing page views
#
@pass_is_preview
@pass_record_or_draft(record_type="marketplace-item", expand=True)
@pass_record_files(record_type="marketplace-item")
def geo_marketplace_item_detail(
    record=None,
    files=None,
    pid_value=None,
    is_preview=False,
    navigate=False,
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
    # Extract extra tags (e.g., GEO Work Programme Activity, Target users) from record
    (
        engagement_priorities,
        programme_activity,
        record_tags,
    ) = record_utilities.extract_extra_record_tags(identity, record)

    return render_template(
        "geo_knowledge_hub/marketplace/details/index.html",
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
        related_engagement_priorities=engagement_priorities,
        navigate=navigate,
        assistance_requests=[],
    )


#
# Export metadata views
#
@pass_is_preview
@pass_record_or_draft(record_type="metadata-item", expand=False)
def record_export(
    pid_value, record, export_format=None, permissions=None, is_preview=False
):
    """Export metadata view."""
    return record_utilities.record_export(pid_value, record, export_format)
