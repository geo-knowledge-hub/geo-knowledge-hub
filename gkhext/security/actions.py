# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Permission and Actions definitions"""

from invenio_access import Permission
from invenio_access import action_factory

#
# Geo Knowledge Community
#
community_action = action_factory("geo-community-access")
community_permission = Permission(community_action)

#
# Geo Knowledge Provider
#
kprovider_action = action_factory("geo-knowledge-provider-access")
kprovider_permission = Permission(kprovider_action)

#
# Geo Secretariat
#
secretariat_action = action_factory("geo-secretariat-access")
secretariat_permission = Permission(secretariat_action)
