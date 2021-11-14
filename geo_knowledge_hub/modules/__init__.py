# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from importlib import import_module


MODULES = [
    "geo_knowledge_hub.modules.rdm",
    "geo_knowledge_hub.modules.frontpage",
    "geo_knowledge_hub.modules.menu",
    "geo_knowledge_hub.modules.deposit",
    "geo_knowledge_hub.modules.context"
]


def init_modules(app):

    # adding view modules
    for module in MODULES:
        mod = import_module(module)
        mod.init_bp(app)
