# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Search (page) module."""

from flask import Blueprint


def init_bp(app):
    """Initialize Search (page) module blueprint."""
    bp = Blueprint("geo_searchpage_bp", __name__, template_folder="templates")

    app.register_blueprint(bp)


__all__ = "init_bp"
