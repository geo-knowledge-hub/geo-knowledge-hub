# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) views."""

from flask import render_template, request
from flask_login import login_required
from geo_config.security.permissions import need_permission
from geo_rdm_records.resources.serializers.ui.serializer import UIJSONSerializer
from invenio_app_rdm.records_ui.views.decorators import pass_draft, pass_draft_files
from invenio_app_rdm.records_ui.views.deposits import get_search_url, new_record

from geo_knowledge_hub.modules.deposit.toolbox.config import get_form_config


@login_required
@need_permission("geo-provider-access")
def geo_deposit_search():
    """List of user deposits page."""
    return render_template(
        "geo_knowledge_hub/records/search_deposit.html",
        searchbar_config=dict(searchUrl=get_search_url()),
    )


@login_required
@need_permission("geo-provider-access")
def geo_deposit_create():
    """Deposit page."""
    valid_types = {
        "knowledge": {"id": "knowledge", "title": {"en": "Knowledge Package"}}
    }

    nrecord = new_record()
    record_type = request.args.get("type")

    if record_type in valid_types and record_type == "knowledge":
        nrecord["metadata"]["resource_type"] = valid_types.get(record_type)

    return render_template(
        "geo_knowledge_hub/records/deposit.html",
        forms_config=get_form_config(createUrl=("/api/records")),
        searchbar_config=dict(searchUrl=get_search_url()),
        record=nrecord,
        files=dict(default_preview=None, entries=[], links={}),
    )


@login_required
@need_permission("geo-provider-access")
@pass_draft
@pass_draft_files
def geo_deposit_edit(draft=None, draft_files=None, pid_value=None):
    """Edit an existing deposit."""
    record = UIJSONSerializer().serialize_object_to_dict(draft.to_dict())

    return render_template(
        "geo_knowledge_hub/records/deposit.html",
        forms_config=get_form_config(apiUrl=f"/api/records/{pid_value}/draft"),
        record=record,
        files=draft_files.to_dict(),
        searchbar_config=dict(searchUrl=get_search_url()),
        permissions=draft.has_permissions_to(["new_version"]),
    )
