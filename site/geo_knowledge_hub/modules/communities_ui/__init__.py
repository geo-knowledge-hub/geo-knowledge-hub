# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Communities UI module."""

from flask import Blueprint

from . import views
from .searchapp import search_app_context


def init_bp(app):
    """Initialize Deposit (page) module blueprint."""
    bp = Blueprint("geokhub_communities_ui_bp", __name__, template_folder="templates")

    # Registration

    # Community frontpage
    bp.add_url_rule(
        "/communities",
        "geokhub_communities_frontpage",
        views.geo_communities_frontpage,
    )

    # Community detail
    bp.add_url_rule(
        "/communities/<pid_value>",
        "geokhub_communities_details",
        views.geo_communities_detail,
    )

    # Register context processor
    bp.app_context_processor(search_app_context)

    app.register_blueprint(bp)
