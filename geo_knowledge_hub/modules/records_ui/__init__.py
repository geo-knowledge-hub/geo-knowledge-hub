# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Records UI module."""

from flask import Blueprint

from . import views
from .searchapp import search_app_context


def init_bp(app):
    """Initialize Deposit (page) module blueprint."""
    bp = Blueprint("geokhub_records_ui_bp", __name__, template_folder="templates")

    # Registration

    # Deposit (Create)
    bp.add_url_rule(
        "/uploads/new",
        "geokhub_record_deposit_create",
        views.geo_record_deposit_create,
    )

    # Deposit (Edit)
    bp.add_url_rule(
        "/uploads/<pid_value>",
        "geokhub_record_deposit_edit",
        views.geo_record_deposit_edit,
    )

    # Visualization
    bp.add_url_rule(
        "/records/<pid_value>", "geokhub_package_view", views.geo_record_detail
    )

    # Exportation
    bp.add_url_rule(
        "/records/<pid_value>/export/<export_format>",
        "geokhub_record_export",
        views.record_export,
    )

    # Register context processor
    bp.app_context_processor(search_app_context)

    app.register_blueprint(bp)


__all__ = "init_bp"
