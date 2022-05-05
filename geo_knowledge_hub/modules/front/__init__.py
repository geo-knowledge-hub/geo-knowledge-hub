# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Front (page) module."""

from flask import Blueprint

from . import views


def init_bp(app):
    """Initialize Front (page) module blueprint."""
    bp = Blueprint(
        "geo_frontpage_bp",
        __name__,
        template_folder="theme/templates",
        static_folder="theme/static",
    )

    # registration
    bp.add_url_rule("/", "front_page", views.frontpage)
    bp.add_url_rule("/overview", "overview", views.overview_page)

    app.register_blueprint(bp)


__all__ = "init_bp"
