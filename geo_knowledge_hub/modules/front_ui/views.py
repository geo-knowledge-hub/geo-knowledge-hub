# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Front (page) views."""

import json

from flask import render_template

from geo_knowledge_hub.modules.base.config import load_from_config


def load_config():
    """Load extra configurations for the Frontpage components."""
    carousel_engagement_config = load_from_config("GKH_CAROUSEL_ENGAGEMENTS_URL")
    carousel_conventions_config = load_from_config("GKH_CAROUSEL_CONVENTIONS_URL")

    list_latest_records_url = load_from_config("GKH_LATEST_RECORDS_URL")
    list_latest_records_more_url = load_from_config("GKH_LATEST_RECORDS_MORE_URL")

    list_latest_events_url = load_from_config("GKH_LATEST_EVENTS_URL")
    list_latest_events_more_url = load_from_config("GKH_LATEST_EVENTS_MORE_URL")

    return dict(
        carousel_engagement_config=carousel_engagement_config,
        carousel_conventions_config=carousel_conventions_config,
        list_latest_records_config=json.dumps(
            {"url": list_latest_records_url, "url_more": list_latest_records_more_url}
        ),
        list_latest_events_config=json.dumps(
            {"url": list_latest_events_url, "url_more": list_latest_events_more_url}
        ),
    )


def frontpage():
    """Render the front-page with the latest Knowledge Packages added."""
    # loading configurations
    configuration = load_config()

    # rendering!
    return render_template(
        "geo_knowledge_hub/frontpage/frontpage.html", **configuration
    )


def overview_page():
    """Render the overview page."""
    return render_template("geo_knowledge_hub/frontpage/overview.html")
