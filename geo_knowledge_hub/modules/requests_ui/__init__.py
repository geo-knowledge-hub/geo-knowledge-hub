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


def init_bp(app):
    """Initialize Deposit (page) module blueprint."""
    bp = Blueprint("geokhub_requests_ui_bp", __name__, template_folder="templates")

    bp.add_url_rule(
        "/me/requests/<request_pid_value>",
        view_func=views.user_dashboard_request_view,
    )

    app.register_blueprint(bp)


__all__ = "init_bp"
