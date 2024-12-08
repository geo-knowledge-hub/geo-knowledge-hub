# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2024 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Marketplace (page) views."""

import json

from flask import g, redirect, render_template
from flask_login import login_required
from geo_rdm_records.base.resources.serializers import (
    UIRecordJSONSerializer as UIJSONSerializer,
)
from geo_rdm_records.modules.security.permissions import need_permission
from geo_rdm_records.proxies import current_marketplace_service
from invenio_app_rdm.records_ui.views.decorators import (
    pass_draft_community,
    pass_is_preview,
)
from invenio_app_rdm.records_ui.views.deposits import get_search_url, new_record

from geo_knowledge_hub.modules.base.config import get_form_config, load_from_config
from geo_knowledge_hub.modules.base.decorators import (
    pass_draft,
    pass_draft_files,
    pass_file_item,
    pass_file_metadata,
    pass_record_files,
    pass_record_latest,
    pass_record_or_draft,
)
from geo_knowledge_hub.modules.base.utilities import awards as awards_utilities
from geo_knowledge_hub.modules.base.utilities import endpoint as endpoint_utilities
from geo_knowledge_hub.modules.base.utilities import metadata as metadata_utilities
from geo_knowledge_hub.modules.base.utilities import records as record_utilities
from geo_knowledge_hub.modules.base.utilities import (
    related_records as related_records_utilities,
)
from geo_knowledge_hub.modules.base.utilities import (
    serialization as serialization_utilities,
)


#
# Utilities
#
def load_config():
    """Load extra configurations for the Marketplace Frontpage."""
    carousel_engagement_config = load_from_config(
        "GKH_CAROUSEL_ENGAGEMENTS_MARKETPLACE_ITEMS_URL"
    )
    carousel_conventions_config = load_from_config(
        "GKH_CAROUSEL_CONVENTIONS_MARKETPLACE_ITEMS_URL"
    )

    list_latest_records_url = load_from_config("GKH_LATEST_MARKETPLACE_ITEMS_URL")
    list_latest_records_more_url = load_from_config(
        "GKH_LATEST_MARKETPLACE_ITEMS_MORE_URL"
    )

    return dict(
        carousel_engagement_config=carousel_engagement_config,
        carousel_conventions_config=carousel_conventions_config,
        list_latest_records_config=json.dumps(
            {"url": list_latest_records_url, "url_more": list_latest_records_more_url}
        ),
    )


#
# Deposit views
#
@login_required
@need_permission("geo-provider-access")
@pass_draft_community
def geo_marketplace_item_create(community=None):
    """Deposit page to create resources."""
    new_record_configuration = new_record()

    # Removing default `license` from the marketplace interface
    if "rights" in new_record_configuration["metadata"]:
        del new_record_configuration["metadata"]["rights"]

    # Extra configurations
    config_awards = awards_utilities.get_configurations()
    config_awards = json.dumps(config_awards)

    return render_template(
        "geo_knowledge_hub/marketplace/deposit/index.html",
        forms_config=get_form_config(createUrl=("/api/marketplace/items")),
        searchbar_config=dict(searchUrl=get_search_url()),
        record=new_record_configuration,
        files=dict(default_preview=None, entries=[], links={}),
        preselectedCommunity=community,
        config_awards=config_awards,
    )


@login_required
@need_permission("geo-provider-access")
@pass_draft(record_type="marketplace-item", expand=True)
@pass_draft_files(record_type="marketplace-item")
def geo_marketplace_item_edit(draft=None, draft_files=None, pid_value=None):
    """Edit an existing record resource deposit."""
    record = UIJSONSerializer().dump_obj(draft.to_dict())

    # Extra configurations
    config_awards = awards_utilities.get_configurations()
    config_awards = json.dumps(config_awards)

    return render_template(
        "geo_knowledge_hub/marketplace/deposit/index.html",
        forms_config=get_form_config(
            apiUrl=f"/api/marketplace/items/{pid_value}/draft"
        ),
        record=record,
        files=draft_files.to_dict(),
        searchbar_config=dict(searchUrl=get_search_url()),
        permissions=draft.has_permissions_to(["new_version"]),
        config_awards=config_awards,
    )


#
# Record Landing page views
#
@pass_record_latest(record_type="marketplace-item")
def geo_marketplace_item_detail_latest(record=None, **kwargs):
    """Redirect to record's latest version page."""
    return redirect(record["links"]["self_html"], code=301)


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
    record_metadata = metadata_utilities.expand_metadata_from_marketplace_item(
        identity, record
    )
    record_endpoint = endpoint_utilities.generate_marketplace_item_endpoint()

    # Extra configurations
    config_awards = awards_utilities.get_configurations()
    config_awards = json.dumps(config_awards)

    # Searching records like the current one
    more_like_this_records = []

    if not is_preview:
        more_like_this_records = related_records_utilities.more_like_this_record(
            identity, record_data["id"], current_marketplace_service, 3
        )

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
        navigate=navigate,
        assistance_requests=[],
        more_like_this_records=more_like_this_records,
        config_awards=config_awards,
        **record_metadata,
        **record_endpoint,
    )


#
# Export metadata views
#
@pass_is_preview
@pass_record_or_draft(record_type="marketplace-item", expand=False)
def geo_marketplace_item_export(
    pid_value, record, export_format=None, permissions=None, is_preview=False
):
    """Export metadata view."""
    return record_utilities.record_export(pid_value, record, export_format)


#
# File views
#
@pass_is_preview
@pass_record_or_draft("marketplace-item")
@pass_file_metadata("marketplace-item")
def geo_marketplace_file_preview(
    pid_value,
    record=None,
    pid_type="recid",
    file_metadata=None,
    is_preview=False,
    **kwargs,
):
    """Render a preview of the specified file."""
    base_url = "geokhub_marketplace_ui_bp.geokhub_marketplace_file_download"

    return record_utilities.record_file_preview(
        base_url, pid_value, record, pid_type, file_metadata, is_preview, **kwargs
    )


@pass_is_preview
@pass_file_item("marketplace-item")
def geo_marketplace_file_download(
    pid_value, file_item=None, is_preview=False, **kwargs
):
    """Download a file from a record."""
    return record_utilities.record_file_download(
        pid_value, file_item, is_preview, **kwargs
    )


def frontpage():
    """Render the marketplace front-page."""
    # loading configurations
    configuration = load_config()

    return render_template(
        "geo_knowledge_hub/marketplace/frontpage/frontpage.html", **configuration
    )
