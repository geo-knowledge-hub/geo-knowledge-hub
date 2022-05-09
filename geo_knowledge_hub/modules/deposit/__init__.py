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


def init_bp(app):
    """Initialize Deposit (page) module blueprint."""
    bp = Blueprint("geokhub_deposit_bp", __name__, template_folder="templates")

    # registration
    bp.add_url_rule("/uploads", "geokhub_deposit_search", views.geo_deposit_search)
    bp.add_url_rule("/uploads/new", "geokhub_deposit_create", views.geo_deposit_create)
    bp.add_url_rule(
        "/uploads/<pid_value>", "geokhub_deposit_edit", views.geo_deposit_edit
    )

    app.register_blueprint(bp)


__all__ = "init_bp"
