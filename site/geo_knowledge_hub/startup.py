# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub context."""

from flask import Blueprint

from geo_knowledge_hub.permissions import GEOCommunityPermissionPolicy

blueprint = Blueprint("geo_knowledge_hub_permissions_bp", __name__)


@blueprint.record_once
def override_communities_permissions(state):
    """Override permission policy class for communities.

    Note:
        This code was adapted from:
            invenio-config-tuw (https://gitlab.tuwien.ac.at/fairdata/invenio-config-tuw/)

        Also, this code wasn't used in the 'app factory' as sometimes the communities modules aren't
        initialized.

    ToDo:
        - Change this implementation after invenio-communities enable the definition
          of custom policies.
    """
    app = state.app
    communities = app.extensions.get("invenio-communities", None)
    assert communities is not None

    # override the permission policy class for all communities services
    svc = communities.service
    svc.config.permission_policy_cls = GEOCommunityPermissionPolicy
    svc.files.config.permission_policy_cls = GEOCommunityPermissionPolicy
    svc.members.config.permission_policy_cls = GEOCommunityPermissionPolicy
