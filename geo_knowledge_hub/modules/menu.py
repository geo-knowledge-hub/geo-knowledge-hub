# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from flask import Blueprint

from flask_menu import current_menu
from flask_babelex import lazy_gettext as _


def init_bp(app):
    bp = Blueprint("geo_menu_bp", __name__)

    @bp.before_app_first_request
    def init_menu():
        """Initialize menu before first request."""
        item = current_menu.submenu("plus-menu.deposit-knowledge")
        item.register(
            "invenio_app_rdm_records.deposit_create",
            _("Knowledge <b>Package</b>"),
            endpoint_arguments_constructor=(lambda: dict(type="knowledge")),
            order=1
        )

        item = current_menu.submenu("plus-menu.deposit-resource")
        item.register(
            "invenio_app_rdm_records.deposit_create",
            _("Knowledge <b>Resource</b>"),
            endpoint_arguments_constructor=(lambda: dict(type="resource")),
            order=2
        )

    app.register_blueprint(bp)


__all__ = (
    "init_bp"
)
