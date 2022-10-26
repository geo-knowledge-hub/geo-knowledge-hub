# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Configuration helper for React-SearchKit."""

from functools import partial

from flask import current_app
from invenio_search_ui.searchconfig import search_app_config


def deposit_package_records_app_context():
    """Search app context processor."""
    return {
        "search_app_package_records_config": partial(
            search_app_config,
            config_name="COMMUNITIES_RECORDS_SEARCH",
            available_facets=current_app.config["RDM_FACETS"],
            sort_options=current_app.config["RDM_SORT_OPTIONS"],
            headers={"Accept": "application/vnd.inveniordm.v1+json"},
            overrides={"urlHandlerApi": {"enabled": False}},
            pagination_options=(2, 3, 5, 10, 15),
            default_size=3,
        ),
    }
