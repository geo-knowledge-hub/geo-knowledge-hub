# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_

from flask import render_template, url_for

from .toolbox.search import get_latest_knowledge_packages
from .toolbox.vocabulary import get_engagement_priority_topics_available


def frontpage():
    """Render the front-page with the latest Knowledge Packages added."""

    # retrieving the required values
    latest_records = get_latest_knowledge_packages(3)
    engagement_priority_topics_available = (
        get_engagement_priority_topics_available().to_dict()
    )

    py_.set(
        engagement_priority_topics_available,
        "hits.hits",
        py_.map(
            py_.get(engagement_priority_topics_available, "hits.hits", []),
            lambda x: py_.set_(
                x, "props.icon", url_for("static", filename=x["props"]["icon"])
            ),
        ),
    )

    # rendering!
    return render_template(
        "geo_knowledge_hub/frontpage/frontpage.html",
        latest_records=latest_records,
        engagement_priority_topics_available=engagement_priority_topics_available,
    )


def overview_page():
    """Render the overview page."""
    return render_template("geo_knowledge_hub/frontpage/overview.html")
