# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2024 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Marketplace UI module."""

from flask import Blueprint

from . import views


def init_bp(app):
    """Initialize Marketplace (deposit and details pages)."""
    bp = Blueprint("geokhub_marketplace_ui_bp", __name__, template_folder="templates")

    # Front page
    bp.add_url_rule(
        "/marketplace",
        "geokhub_marketplace_front_page",
        views.frontpage,
    )

    # Registration
    # Deposit (Create)
    bp.add_url_rule(
        "/uploads/marketplace/items/new",
        "geokhub_marketplace_item_create",
        views.geo_marketplace_item_create,
    )

    # Deposit (Edit)
    bp.add_url_rule(
        "/uploads/marketplace/items/<pid_value>",
        "geokhub_marketplace_item_edit",
        views.geo_marketplace_item_edit,
    )

    # Visualization
    bp.add_url_rule(
        "/marketplace/items/<pid_value>",
        "geokhub_marketplace_item_view",
        views.geo_marketplace_item_detail,
    )

    # Visualization (Latest version)
    bp.add_url_rule(
        "/marketplace/items/<pid_value>/latest",
        "geokhub_marketplace_item_view_latest",
        views.geo_marketplace_item_detail_latest,
    )

    # Exportation
    bp.add_url_rule(
        "/marketplace/items/<pid_value>/export/<export_format>",
        "geokhub_marketplace_item_export",
        views.geo_marketplace_item_export,
    )

    # Files
    bp.add_url_rule(
        "/marketplace/items/<pid_value>/preview/<path:filename>",
        "geokhub_marketplace_file_preview",
        views.geo_marketplace_file_preview,
    )

    bp.add_url_rule(
        "/marketplace/items/<pid_value>/files/<path:filename>",
        "geokhub_marketplace_file_download",
        views.geo_marketplace_file_download,
    )

    app.register_blueprint(bp)
