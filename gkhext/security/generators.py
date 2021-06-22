# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Permission Generators definitions"""

from flask_principal import ActionNeed
from invenio_records_permissions.generators import AuthenticatedUser


class GeoSecretariat(AuthenticatedUser):
    def __init__(self):
        super(GeoSecretariat, self).__init__()

    def needs(self, **kwargs):
        return [
            ActionNeed("geo-secretariat-access")
        ]


class GeoKnowledgeProvider(AuthenticatedUser):
    def __init__(self):
        super(GeoKnowledgeProvider, self).__init__()

    def needs(self, **kwargs):
        return [
            ActionNeed("geo-knowledge-provider-access")
        ]


class GeoCommunity(AuthenticatedUser):
    def __init__(self):
        super(GeoCommunity, self).__init__()

    def needs(self, **kwargs):
        return [
            ActionNeed("geo-community-access")
        ]
