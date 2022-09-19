# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) module."""

from flask import Blueprint

from . import views
from .searchapp import search_app_context


def init_bp(app):
    """Initialize Deposit (page) module blueprint."""
    bp = Blueprint("geokhub_records_ui_bp", __name__, template_folder="templates")

    # Registration

    # Deposit (Create)
    bp.add_url_rule(
        "/uploads/packages/new",
        "geokhub_package_deposit_create",
        views.geo_package_deposit_create,
    )

    bp.add_url_rule(
        "/uploads/resources/new",
        "geokhub_resource_deposit_create",
        views.geo_resource_deposit_create,
    )

    # Deposit (Edit)
    bp.add_url_rule(
        "/uploads/packages/<pid_value>",
        "geokhub_package_deposit_edit",
        views.geo_package_deposit_edit,
    )

    bp.add_url_rule(
        "/uploads/packages/<pid_value>",
        "geokhub_resource_deposit_edit",
        views.geo_resource_deposit_edit,
    )

    # Register context processor
    bp.app_context_processor(search_app_context)

    app.register_blueprint(bp)


__all__ = "init_bp"
