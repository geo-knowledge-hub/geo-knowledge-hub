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

# GEO Components React
# ====================
GKH_CAROUSEL_ENGAGEMENTS_URL = "/search?q=metadata.engagement_priorities.id:"
GKH_CAROUSEL_CONVENTIONS_URL = "/search?q=metadata.engagement_priorities.id:"

GKH_LATEST_RECORDS_URL = "/api/packages?sort=newest&size=3"
GKH_LATEST_RECORDS_MORE_URL = "/search"

GKH_LATEST_EVENTS_URL = "https://gkhub.earthobservations.org:8443/api/events?sort[0]=date&pagination[limit]=3"
GKH_LATEST_EVENTS_MORE_URL = "https://gkhub.earthobservations.org/doc/events"

# GEO Analytics
# ==============
GKH_ANALYTICS_CONFIG = {
    "domain": "gkhub.earthobservations.org",
    "script": "/js/analytics.js",
}

# Share widget
# ============
GKH_SHARE_WIDGET_CONFIG = {
    "base": {"script": "https://static.addtoany.com/menu/page.js"},
    "widget": {"script": "//s7.addthis.com/js/300/addthis_widget.js#pubid=id-here"},
    "config": {"number_of_services": 6},
}
