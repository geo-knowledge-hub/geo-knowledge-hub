# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub permissions module."""

from geo_rdm_records.modules.security.generators import GeoSecretariat
from invenio_communities.permissions import CommunityPermissionPolicy
from invenio_records_permissions.generators import SystemProcess


class GEOCommunityPermissionPolicy(CommunityPermissionPolicy):
    """Permissions for Community CRUD operations."""

    can_create = [GeoSecretariat(), SystemProcess()]
