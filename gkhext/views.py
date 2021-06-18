# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

from typing import Dict

from elasticsearch_dsl.utils import AttrDict
from flask import (
    request,
    url_for,
    redirect,
    Blueprint,
    current_app,
    render_template,
)
from flask_mail import Message
from invenio_app_rdm.records_ui.views.decorators import (
    pass_record_files,
    pass_record_latest,
)
from invenio_rdm_records.resources.serializers import UIJSONSerializer

from .controller import (
    get_related_resources_metadata,
    current_user_invenio_profile
)
from .forms import RequestAccessForm


def generate_ui_bp(flask_app):
    routes = flask_app.config.get("GKH_ROUTES")

    bp = Blueprint(
        'geokhb_theme',
        __name__,
        template_folder="templates",
    )

    @bp.app_template_filter("make_dict_like")
    def make_dict_like(value: str, key: str) -> Dict[str, str]:
        """Convert the value to a dict like structure.
        in the form of a key -> value pair.
        """
        return {key: value}

    @bp.app_template_filter("cast_to_dict")
    def cast_to_dict(attr_dict):
        """Return the dict structure of AttrDict variable."""
        return AttrDict.to_dict(attr_dict)

    return bp


"""New Geo Knowledge Pages"""


#
# Record views
#

@pass_record_latest
@pass_record_files
def record_detail_page_render(record=None, files=None, pid_value=None, is_preview=False):
    """Function to render landing page (Record detail page)
    """

    files_dict = None if files is None else files.to_dict()
    related_records_informations = get_related_resources_metadata(record.to_dict()["metadata"])

    current_user_profile = current_user_invenio_profile()

    return render_template(
        "gkhext/records/detail.html",
        record=UIJSONSerializer().serialize_object_to_dict(record.to_dict()),
        pid=pid_value,
        files=files_dict,
        permissions=record.has_permissions_to(['edit', 'new_version', 'manage',
                                               'update_draft', 'read_files']),
        is_preview=is_preview,
        current_user_profile=current_user_profile,
        related_records_informations=related_records_informations
    )


#
# Forms views
#
def request_access_view():
    """Function to render Request Access view"""

    form = RequestAccessForm()
    form.process(request.form)

    if form.validate_on_submit():
        message = Message(
            f"Geo Knowledge Hub Registration",
            recipients=[
                current_app.config.get(
                    "GEO_MAIL_DEFAULT_RECEIVER"
                ),
                form.email.data
            ],
            body=f"Thank you {form.name.data} for your subscription"
        )

        current_app.extensions["mail"].send(message)
        return redirect(url_for("request_access_page"))
    return render_template(
        "gkhext/request_access.html",
        form=form,
        template="form-template"
    )


"""Overwriting pages for adding specific function requirements"""

#
# Deposit Pages
#

from invenio_app_rdm.records_ui.views.deposits import (
    deposit_create,
    deposit_edit,
    deposit_search
)

from .security.actions import kprovider_permission


@kprovider_permission.require(http_exception=403)
def deposit_create_permissioned():
    return deposit_create()


@kprovider_permission.require(http_exception=403)
def deposit_edit_permissioned(pid_value):
    return deposit_edit(pid_value=pid_value)


@kprovider_permission.require(http_exception=403)
def deposit_search_permissioned():
    return deposit_search()


deposit_views = [
    {
        "endpoint": "/uploads",
        "name": "geo_deposit_search",
        "func": deposit_search_permissioned
    },
    {
        "endpoint": "/uploads/new",
        "name": "geo_deposit_create",
        "func": deposit_create_permissioned
    },
    {
        "endpoint": "/uploads/<pid_value>",
        "name": "geo_deposit_edit",
        "func": deposit_edit_permissioned
    }
]

#
# Communities pages
#

from invenio_communities.views.communities import (
    communities_new
)

from .security.actions import secretariat_permission


@secretariat_permission.require(http_exception=403)
def communities_new_permissioned():
    return communities_new()


communities_views = [
    {
        "endpoint": "/communities/new",
        "name": "geo_communities_new",
        "func": communities_new_permissioned
    },
]
