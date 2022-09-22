# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Communities UI views."""

from flask import render_template
from invenio_communities.views.decorators import pass_community


@pass_community(serialize=True)
def geo_communities_detail(pid_value, community, community_ui):
    """Community detail page."""
    permissions = community.has_permissions_to(
        ["update", "read", "search_requests", "search_invites"]
    )
    endpoint = "/api/communities/{pid_value}/search"

    return render_template(
        "geo_knowledge_hub/communities/details/index.html",
        community=community_ui,
        # Pass permissions so we can disable partially UI components
        # e.g Settings tab
        permissions=permissions,
        active_community_header_menu_item="search",
        endpoint=endpoint.format(pid_value=community.to_dict()["id"]),
    )
