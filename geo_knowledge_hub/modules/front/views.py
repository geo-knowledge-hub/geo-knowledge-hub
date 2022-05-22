# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Front (page) views."""

from flask import render_template
from .toolbox.search import get_latest_knowledge_packages


def frontpage():
    """Render the front-page with the latest Knowledge Packages added."""
    # retrieving the required values
    latest_records = get_latest_knowledge_packages(3)

    # rendering!
    return render_template(
        "geo_knowledge_hub/frontpage/frontpage.html",
        latest_records=latest_records
    )


def overview_page():
    """Render the overview page."""
    return render_template("geo_knowledge_hub/frontpage/overview.html")
