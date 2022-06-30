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
    "geo_knowledge_hub.modules.base",
    "geo_knowledge_hub.modules.front",
    "geo_knowledge_hub.modules.menu",
    "geo_knowledge_hub.modules.deposit",
    "geo_knowledge_hub.modules.detail",
    "geo_knowledge_hub.modules.context",
    "geo_knowledge_hub.modules.search",
    "geo_knowledge_hub.modules.dashboard",
]


def init_modules(app):
    """Initialize the extension modules using application factory concepts."""
    # adding view modules
    for module in MODULES:
        mod = import_module(module)
        mod.init_bp(app)
