# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

# TODO: This is an example file. Remove it if your package does not use any
# extra configuration variables.

GEO_KNOWLEDGE_HUB_EXT_DEFAULT_VALUE = 'foobar'
"""Default value for the application."""

GEO_KNOWLEDGE_HUB_EXT_BASE_TEMPLATE = 'geo_knowledge_hub/base.html'
"""Default base template for the demo page."""

# THEME_FRONTPAGE_TEMPLATE = 'gkhext/frontpage/frontpage.html'
# """Frontpage template."""

# THEME_HEADER_TEMPLATE = 'gkhext/frontpage/header.html'
# """Header base template."""

# THEME_FOOTER_TEMPLATE = 'gkhext/frontpage/footer.html'
# """Footer base template."""

GEO_KNOWLEDGE_HUB_EXT_SIDE_BAR_ELEMENTS = [
    "geo-knowledge-hub/records/details/side_bar/versions.html",
    "geo-knowledge-hub/records/details/side_bar/related_identifiers.html",
    "geo-knowledge-hub/records/details/side_bar/export.html"
]

GEO_KNOWLEDGE_HUB_EXT_INFORMATION_REQUIRED_IN_METADATA_BY_SCHEME = {
    "doi": {
        "id": "id",
        "title": "metadata.title",
        "resource_type": "metadata.resource_type.title.en",
        "description": "metadata.description"
    }
}
"""Default values to load from metadata by scheme type."""

RECORDS_PERMISSIONS_RECORD_POLICY = (
    "geo_knowledge_hub.security.policies.GeoRecordPermissionPolicy"
)
"""Policy settings"""

GEO_KNOWLEDGE_HUB_EXT_DEFAULT_MAIL_RECEIVER = "geo-email-default"

#     Flask-Mail
# ===================

## See configurations options at: https://pythonhosted.org/Flask-Mail/#configuring-flask-mail

# Flask-Discussion (with Isso engine)
# ===================================

## See Flask-Discussion options for Isso at: https://flask-discussion.readthedocs.io/en/latest/configs/isso.html
