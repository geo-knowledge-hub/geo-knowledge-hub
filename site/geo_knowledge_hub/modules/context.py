# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub context."""

from flask import Blueprint, g
from geo_rdm_records.modules.security.permissions import (
    provider_user_permission,
    secretariat_user_permission,
)


def init_bp(app):
    """Initialize app."""
    bp = Blueprint("geo_knowledge_hub_bp", __name__)

    def define_user_profile():
        is_geo_secretariat = False
        is_knowledge_provider = False

        if "identity" in g:
            is_knowledge_provider = provider_user_permission().can()
            is_geo_secretariat = secretariat_user_permission().can()

        return dict(
            is_knowledge_provider=is_knowledge_provider,
            is_geo_secretariat=is_geo_secretariat,
        )

    # Registering the user context processor
    bp.app_context_processor(define_user_profile)
    app.register_blueprint(bp)


__all__ = "init_bp"
