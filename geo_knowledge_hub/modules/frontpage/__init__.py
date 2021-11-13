# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from flask import Blueprint

from . import views


def init_bp(app):
    bp = Blueprint("geo_frontpage_bp", __name__, template_folder="theme/templates")

    # registration
    bp.add_url_rule("/", "front_page", views.frontpage)
    bp.add_url_rule("/about", "about", views.about_page)
    bp.add_url_rule("/engage", "engage", views.engage_page)
    bp.add_url_rule("/discover", "discover", views.discover_page)
    bp.add_url_rule("/contribute", "contribute", views.contribute_page)

    app.register_blueprint(bp)


__all__ = (
    "init_bp"
)
