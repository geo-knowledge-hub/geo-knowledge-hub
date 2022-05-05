# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Detail (page) module."""

from flask import Blueprint

from . import views


def init_bp(app):
    """Initialize Detail (page) module blueprint."""
    bp = Blueprint("geo_landing_bp", __name__, template_folder="theme/templates")

    # registration
    bp.add_url_rule(
        "/records/<pid_value>", "geokhub_record_detail", views.geo_record_detail
    )

    app.register_blueprint(bp)


__all__ = "init_bp"
