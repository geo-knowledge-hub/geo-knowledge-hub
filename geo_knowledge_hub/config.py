# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension configurations."""

# Flask-WebpackExt
# ================
# See https://flask-webpackext.readthedocs.io/en/latest/configuration.html
WEBPACKEXT_PROJECT = "geo_knowledge_hub.theme.webpack:project"


# Invenio-RDM-Records
# ====================
RDM_COMMUNITIES_ROUTES = {
    "community-detail": "/communities/<pid_value>",
}
