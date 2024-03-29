# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Dashboard module."""

from flask import Blueprint

from . import views
from .searchapp import search_app_context


def init_bp(app):
    """Initialize Dashboard (page) module blueprint."""
    bp = Blueprint("geokhub_dashboard_bp", __name__, template_folder="templates")

    # registration
    bp.add_url_rule("/me", "geokhub_userdashboard", views.geo_user_uploads)
    bp.add_url_rule(
        "/me/uploads", "geokhub_userdashboard_uploads", views.geo_user_uploads
    )

    # Register context processor
    bp.app_context_processor(search_app_context)

    app.register_blueprint(bp)


__all__ = "init_bp"
