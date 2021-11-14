# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM."""

from . import config
from .modules import init_modules


class GeoKnowledgeHub(object):
    """geo-knowledge-hub-ext extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)
        self.init_modules(app)

        app.extensions["geo-knowledge-hub"] = self

    def init_config(self, app):
        """Initialize configuration."""
        # Use theme's base template if theme is installed
        if "BASE_TEMPLATE" in app.config:
            app.config.setdefault(
                "GEO_KNOWLEDGE_HUB_EXT_BASE_TEMPLATE",
                app.config["BASE_TEMPLATE"],
            )
        for k in dir(config):
            if k.startswith("GEO_KNOWLEDGE_HUB_"):
                app.config.setdefault(k, getattr(config, k))

    def init_modules(self, app):
        """Initialize the extension modules."""
        init_modules(app)
