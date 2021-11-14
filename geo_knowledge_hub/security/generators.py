# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Permission Generators definitions"""

from invenio_records_permissions.generators import Generator

from .permissions import (
    geo_community_access_action,
    geo_provider_access_action,
    geo_secretariat_access_action
)


class GeoSecretariat(Generator):
    def __init__(self):
        super(GeoSecretariat, self).__init__()

    def needs(self, **kwargs):
        return [
            geo_secretariat_access_action
        ]


class GeoKnowledgeProvider(Generator):
    def __init__(self):
        super(GeoKnowledgeProvider, self).__init__()

    def needs(self, **kwargs):
        return [
            geo_provider_access_action
        ]


class GeoCommunity(Generator):
    def __init__(self):
        super(GeoCommunity, self).__init__()

    def needs(self, **kwargs):
        return [
            geo_community_access_action
        ]


__all__ = (
    "GeoCommunity",
    "GeoSecretariat",
    "GeoKnowledgeProvider"
)
