# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from flask import Blueprint


def init_bp(app):
    bp = Blueprint("geokhub_assets_bp", __name__, static_folder="static")

    app.register_blueprint(bp)


__all__ = "init_bp"
