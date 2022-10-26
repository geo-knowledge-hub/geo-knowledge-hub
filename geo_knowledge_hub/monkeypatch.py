# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub monkey patch modules."""

from invenio_communities.permissions import CommunityPermissionPolicy

from .permissions import GEOCommunityPermissionPolicy

"""
This is a temporary solution to enable us to change the Communities
service permissions.
"""


def update_overwritten_permissions(source_class, target_class, permission_prefix="can"):
    """Introspect code to change properties."""
    for property_ in list(filter(lambda x: permission_prefix in x, dir(source_class))):
        setattr(source_class, property_, getattr(target_class, property_))


# Monkey patching the community permissions (This is temporary)
def monkeypatch_permission():
    """Monkey patch permissions."""
    update_overwritten_permissions(
        CommunityPermissionPolicy, GEOCommunityPermissionPolicy
    )
