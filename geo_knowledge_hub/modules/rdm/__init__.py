# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub RDM module."""

from flask import Blueprint


def init_bp(app):
    """Initialize RDM module blueprint."""
    bp = Blueprint("geo_base_bp", __name__, template_folder="theme/templates")
    app.register_blueprint(bp)


__all__ = "init_bp"
