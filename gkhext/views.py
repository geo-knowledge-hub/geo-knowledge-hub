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
from flask import Blueprint, render_template
from invenio_app_rdm.records_ui.views.decorators import (
    pass_record_files,
    pass_record,
)
from invenio_rdm_records.resources.serializers import UIJSONSerializer

from .controller import get_related_resources_metadata


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


@pass_record
@pass_record_files
def record_detail_page_render(record=None, files=None, pid_value=None, is_preview=False):
    """Function to render landing page (Record detail page)
    """

    files_dict = None if files is None else files.to_dict()
    related_records_informations = get_related_resources_metadata(record.to_dict()["metadata"])

    return render_template(
        "gkhext/records/detail.html",
        record=UIJSONSerializer().serialize_object_to_dict(record.to_dict()),
        pid=pid_value,
        files=files_dict,
        permissions=record.has_permissions_to(['edit', 'new_version', 'manage',
                                               'update_draft', 'read_files']),
        is_preview=is_preview,
        related_records_informations=related_records_informations
    )
