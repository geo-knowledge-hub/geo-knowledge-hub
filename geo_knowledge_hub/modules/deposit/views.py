# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_

from flask import request, render_template
from flask_login import login_required

from invenio_app_rdm.records_ui.views.deposits import (
    get_form_config,
    get_search_url,
    new_record
)

from invenio_app_rdm.records_ui.views.decorators import (
    pass_record_files,
    pass_draft,
    pass_draft_files,
    pass_record_or_draft,
)

from invenio_rdm_records.resources.serializers import UIJSONSerializer

from .toolbox.search import get_related_resources_metadata
from .toolbox.identifiers import related_identifiers_url_by_scheme

from ...security.permissions import need_permission


@login_required
@need_permission("geo-provider-access")
def geo_deposit_search():
    """List of user deposits page."""
    return render_template(
        "geo_knowledge_hub/records/search_deposit.html",
        searchbar_config=dict(searchUrl=get_search_url())
    )


@pass_record_or_draft
@pass_record_files
def geo_record_detail(record=None, files=None, pid_value=None, is_preview=False):
    """Record detail page (aka landing page)."""
    files_dict = None if files is None else files.to_dict()
    related_records_informations = get_related_resources_metadata(record.to_dict()["metadata"])

    related_identifiers = py_.get(record.data, "metadata.related_identifiers", [])
    related_identifiers = related_identifiers_url_by_scheme(related_identifiers)

    # removing all related resource that is a knowledge resource
    related_identifiers = py_.filter(
        related_identifiers, lambda x: x["identifier"].split("/")[-1] not in py_.map(
            related_records_informations, lambda y: y["id"]
        )
    )

    return render_template(
        "geo_knowledge_hub/records/detail.html",
        pid=pid_value,
        files=files_dict,
        is_preview=is_preview,
        related_identifiers=related_identifiers,
        related_records_informations=related_records_informations,
        record=UIJSONSerializer().serialize_object_to_dict(record.to_dict()),

        permissions=record.has_permissions_to(["edit", "new_version", "manage",
                                               "update_draft", "read_files"])
    )


@login_required
@need_permission("geo-provider-access")
def geo_deposit_create():
    """Deposit page"""
    valid_types = {
        "knowledge": {
            "id": "knowledge",
            "title": {
                "en": "Knowledge Package"
            }
        }
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
        files=dict(
            default_preview=None, entries=[], links={}
        ), )


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
        permissions=draft.has_permissions_to(['new_version'])
    )
