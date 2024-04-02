# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2024 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub analytics."""


from flask import Blueprint, current_app


def init_bp(app):
    """Initialize app."""
    bp = Blueprint("geokhub_share_widget_bp", __name__)

    def define_share_widget_script():
        share_config = current_app.config["GKH_SHARE_WIDGET_CONFIG"]

        return dict(share_widget=share_config)

    # Registering the user context processor
    bp.app_context_processor(define_share_widget_script)
    app.register_blueprint(bp)


__all__ = "init_bp"
