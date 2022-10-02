# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension modules."""

from importlib import import_module

MODULES = [
    # Configurations and context
    "geo_knowledge_hub.modules.menu",
    "geo_knowledge_hub.modules.context",
    # User interface
    "geo_knowledge_hub.modules.base",
    "geo_knowledge_hub.modules.front_ui",
    "geo_knowledge_hub.modules.records_ui",
    "geo_knowledge_hub.modules.users_ui",
    "geo_knowledge_hub.modules.communities_ui",
    "geo_knowledge_hub.modules.packages_ui",
    "geo_knowledge_hub.modules.requests_ui",
]


def init_modules(app):
    """Initialize the extension modules using application factory concepts."""
    # adding view modules
    for module in MODULES:
        mod = import_module(module)
        mod.init_bp(app)
