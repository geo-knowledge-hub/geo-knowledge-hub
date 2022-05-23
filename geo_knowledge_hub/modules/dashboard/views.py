# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub User Dashboard views."""

from flask import current_app, render_template
from flask_login import login_required
from invenio_app_rdm.records_ui.views.deposits import get_search_url
from invenio_userprofiles import current_userprofile


@login_required
def geo_user_dashboard(dashboard_name=None):
    """Display user dashboard page."""
    if not current_app.config["COMMUNITIES_ENABLED"] or not dashboard_name:
        dashboard_name = current_app.config["_DASHBOARD_ROUTES"][0]
    return render_template(
        "geo_knowledge_hub/dashboard/user.html",
        dashboard_name=dashboard_name,
        searchbar_config=dict(searchUrl=get_search_url()),
        communities_enabled=current_app.config["COMMUNITIES_ENABLED"],
        username=current_userprofile.full_name,
    )
