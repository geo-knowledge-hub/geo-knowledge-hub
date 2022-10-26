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
from .searchapp import deposit_package_records_app_context


def init_bp(app):
    """Initialize Deposit (page) module blueprint."""
    bp = Blueprint("geokhub_packages_ui_bp", __name__, template_folder="templates")

    # Registration

    # Deposit (Create)
    bp.add_url_rule(
        "/uploads/packages/new",
        "geokhub_package_deposit_create",
        views.geo_package_deposit_create,
    )

    # Deposit (Edit)
    bp.add_url_rule(
        "/uploads/packages/<pid_value>",
        "geokhub_package_deposit_edit",
        views.geo_package_deposit_edit,
    )

    # Visualization
    bp.add_url_rule(
        "/packages/<pid_value>", "geokhub_package_view", views.geo_package_detail
    )

    # Visualization (Latest version)
    bp.add_url_rule(
        "/packages/<pid_value>/latest",
        "geo_package_view_latest",
        views.geo_package_detail_latest,
    )

    # Exportation
    bp.add_url_rule(
        "/packages/<pid_value>/export/<export_format>",
        "geokhub_package_export",
        views.record_export,
    )

    # Files
    bp.add_url_rule(
        "/packages/<pid_value>/preview/<path:filename>",
        "record_file_preview",
        views.record_file_preview,
    )

    bp.add_url_rule(
        "/packages/<pid_value>/files/<path:filename>",
        "record_file_download",
        views.record_file_download,
    )

    # Register context processor
    bp.app_context_processor(deposit_package_records_app_context)

    app.register_blueprint(bp)


__all__ = "init_bp"
