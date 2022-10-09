# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub context."""

from flask import Blueprint, g
from geo_config.security.permissions import provider_user_permission


def init_bp(app):
    """Initialize app."""
    bp = Blueprint("geo_knowledge_hub_bp", __name__)

    def define_user_profile():
        is_knowledge_provider = False
        if "identity" in g:
            is_knowledge_provider = provider_user_permission().can()

        return {
            "is_knowledge_provider": is_knowledge_provider
        }

    # Registering the user context processor
    bp.app_context_processor(define_user_profile)
    app.register_blueprint(bp)


__all__ = "init_bp"
