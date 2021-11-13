# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from flask import render_template

from .toolbox.search import get_latest_knowledge_packages


def frontpage():
    """Render the front-page with the latest Knowledge Packages added."""
    latest_records = get_latest_knowledge_packages(3)

    return render_template(
        "geo_knowledge_hub/frontpage/frontpage.html",
        latest_records=latest_records
    )


def about_page():
    """Render the about page"""
    return render_template("geo_knowledge_hub/frontpage/about.html")


def discover_page():
    """Render the discover page"""
    return render_template("geo_knowledge_hub/frontpage/discover.html")


def contribute_page():
    """Render the contribute page"""
    return render_template("geo_knowledge_hub/frontpage/contribute.html")


def engage_page():
    """Render the engagement page"""
    return render_template("geo_knowledge_hub/frontpage/engage.html")
