# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_

from flask import g, Blueprint
from flask_security import current_user

from invenio_userprofiles.api import current_userprofile
from geo_config.security.permissions import provider_user_permission


def current_user_invenio_profile():
    """Get current user profile"""
    if current_user.is_authenticated:
        return {
            "name": py_.get(current_userprofile, "full_name", None),
            "email": py_.get(current_userprofile, "user.email", None)
        }
    return None


def init_bp(app):
    """Initialize app."""
    bp = Blueprint("geo_knowledge_hub_bp", __name__)

    def define_user_profile():
        is_knowledge_provider = False
        if "identity" in g:
            is_knowledge_provider = provider_user_permission().can()

        return {
            "is_knowledge_provider": is_knowledge_provider,
            "current_user_profile": current_user_invenio_profile()
        }

    # Registering the user context processor
    bp.app_context_processor(define_user_profile)
    app.register_blueprint(bp)


__all__ = (
    "init_bp"
)
