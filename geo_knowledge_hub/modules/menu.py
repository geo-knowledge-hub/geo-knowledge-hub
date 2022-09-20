# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub flask menu."""

from flask import Blueprint
from flask_babelex import lazy_gettext as _
from flask_menu import current_menu


def init_bp(app):
    """Initialize the flask menu blueprint."""
    bp = Blueprint("geo_menu_bp", __name__)

    @bp.before_app_first_request
    def init_menu():
        """Initialize menu before first request."""
        item = current_menu.submenu("overview.check")
        item.register("geo_frontpage_bp.overview", _("About"), order=1)

        item = current_menu.submenu("plus-menu.deposit-knowledge")
        item.register(
            "geokhub_records_ui_bp.geokhub_package_deposit_create",
            _("Knowledge <b>Package</b>"),
            order=1,
        )

        item = current_menu.submenu("plus-menu.deposit-record")
        item.register(
            "geokhub_records_ui_bp.geokhub_record_deposit_create",
            _("Knowledge <b>Resource</b>"),
            order=2,
        )

    app.register_blueprint(bp)


__all__ = "init_bp"
