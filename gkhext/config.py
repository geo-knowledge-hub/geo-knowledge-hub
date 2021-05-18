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

GEO_KNOWLEDGE_HUB_EXT_BASE_TEMPLATE = 'gkhext/base.html'
"""Default base template for the demo page."""

GEO_KNOWLEDGE_HUB_EXT_INFORMATION_REQUIRED_IN_METADATA_BY_SCHEME = {
    "doi": {  # test if this works with an internal fake doi
        "title": "metadata.title",
        "resource_type": "metadata.resource_type.type",
        "description": "metadata.description",
        "url": "links.self_html"
    }
}
"""Default values to load from metadata by scheme type."""
