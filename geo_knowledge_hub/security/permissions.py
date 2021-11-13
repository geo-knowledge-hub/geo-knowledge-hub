# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Base Security Policies."""

from flask import abort, current_app
from flask_login import current_user

from functools import wraps
from invenio_access import action_factory, Permission

#
# Actions
#

# GEO Knowledge Community
geo_community_access_action = action_factory("geo-community-access")

# GEO Knowledge Provider
geo_provider_access_action = action_factory("geo-provider-access")

# GEO Secretariat
geo_secretariat_access_action = action_factory("geo-secretariat-access")


#
# Permissions
#

def community_user_permission():
    return Permission(geo_community_access_action)


def provider_user_permission():
    return Permission(geo_provider_access_action)


def secretariat_user_permission():
    return Permission(geo_secretariat_access_action)


#
# Decorators
#

def check_permission(permission):
    """Check if user has the specified permission.

    See:
        This function is adapted from the invenio-circulation:
        https://github.com/inveniosoftware/invenio-circulation/blob/master/invenio_circulation/permissions.py
    """
    # NOTE: we have to explicitly check for not None, since flask-principal
    # overrides the default __bool__ implementation for permission.
    # (https://github.com/inveniosoftware/invenio-circulation/blob/master/invenio_circulation/permissions.py)
    if permission is not None and not permission.can():
        if not current_user.is_authenticated:
            abort(401)
        abort(403)


def need_permission(action: str):
    """View decorator to check permissions for the given action or abort.

    Args:
        action (str): Action needed

    See:
        This function is adapted from the invenio-circulation:
            https://github.com/inveniosoftware/invenio-circulation/blob/master/invenio_circulation/permissions.py
    """

    def decorator(f):
        @wraps(f)
        def decorate(*args, **kwargs):
            check_permission(
                current_app.config["GEO_KNOWLEDGE_HUB_VIEW_PERMISSIONS_FACTORY"](action)
            )
            return f(*args, **kwargs)

        return decorate

    return decorator


#
# Factories
#

def views_permissions_factory(action):
    allowed_actions = {
        "geo-provider-access": provider_user_permission(),
        "geo-community-access": community_user_permission(),
        "geo-secretariat-access": secretariat_user_permission()
    }

    return allowed_actions.get(action, None)
