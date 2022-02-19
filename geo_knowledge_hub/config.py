# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""
from .security.policies import GeoRecordPermissionPolicy
from .security.permissions import views_permissions_factory

GEO_KNOWLEDGE_HUB_EXT_BASE_TEMPLATE = "geo_knowledge_hub/base/base.html"
"""Default base template for the demo page."""

GEO_KNOWLEDGE_HUB_EXT_SIDE_BAR_ELEMENTS = [
    # GEO Knowledge Hub: Versions
    "geo_knowledge_hub/records/details/side_bar/versions.html",

    # GEO Feedback
    "geo_feedback/records/details/side_bar/feedback.html",

    # GEO Priorities
    "geo_priorities/records/details/side_bar/engagement_priorities.html",

    # GEO Metadata Previewer
    "geo_metadata_previewer/records/details/side_bar/base_map.html",

    # GEO Knowledge Hub: Related identifiers
    # "geo_knowledge_hub/records/details/side_bar/related_identifiers.html",

    # GEO Knowledge Hub: Export formats
    # "geo_knowledge_hub/records/details/side_bar/export.html"
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

RDM_PERMISSION_POLICY = GeoRecordPermissionPolicy
"""Policy settings."""

GEO_KNOWLEDGE_HUB_VIEW_PERMISSIONS_FACTORY = views_permissions_factory
"""View permissions factory."""

# See Flask-Mail configurations options at:
#   https://pythonhosted.org/Flask-Mail/#configuring-flask-mail
"""Flask-Mail"""

# See Flask-Discussion (for Isso engine) options for Isso at:
#   https://flask-discussion.readthedocs.io/en/latest/configs/isso.html
"""Flask-Discussion"""
