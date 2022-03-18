# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

GEO_KNOWLEDGE_HUB_EXT_INFORMATION_REQUIRED_IN_METADATA_BY_SCHEME = {
    "doi": {
        "id": "id",
        "title": "metadata.title",
        "resource_type": "metadata.resource_type.title.en",
        "description": "metadata.description",
    }
}
"""Default values to load from metadata by scheme type."""

# See Flask-Mail configurations options at:
#   https://pythonhosted.org/Flask-Mail/#configuring-flask-mail
"""Flask-Mail"""

# See Flask-Discussion (for Isso engine) options for Isso at:
#   https://flask-discussion.readthedocs.io/en/latest/configs/isso.html
"""Flask-Discussion"""
