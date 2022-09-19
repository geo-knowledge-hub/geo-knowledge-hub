# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub User Dashboard views."""

from flask import render_template
from flask_login import current_user, login_required
from invenio_users_resources.proxies import current_user_resources
from invenio_app_rdm.records_ui.views.deposits import get_search_url


@login_required
def geo_user_uploads():
    """Display user dashboard page."""
    url = current_user_resources.users_service.links_item_tpl.expand(current_user)[
        "avatar"
    ]
    return render_template(
        "geo_knowledge_hub/users/uploads.html",
        searchbar_config=dict(searchUrl=get_search_url()),
        user_avatar=url
    )
