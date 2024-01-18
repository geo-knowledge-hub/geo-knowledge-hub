# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Record and Package Request related record."""

from flask import g, render_template
from flask_login import current_user, login_required
from invenio_app_rdm.records_ui.views.deposits import load_custom_fields
from invenio_communities.members.services.request import CommunityInvitation
from invenio_communities.views.decorators import pass_community
from invenio_rdm_records.requests import CommunitySubmission
from invenio_records_resources.services.errors import PermissionDeniedError
from invenio_requests.customizations import AcceptAction
from invenio_requests.views.decorators import pass_request
from invenio_users_resources.proxies import current_user_resources

from geo_knowledge_hub.modules.base.registry import (
    get_draft_files_service,
    get_files_service,
    get_record_service,
)
from geo_knowledge_hub.modules.base.utilities import metadata as metadata_utilities
from geo_knowledge_hub.modules.base.utilities import records as record_utilities

from .toolbox import requests as requests_utilities


@login_required
@pass_request(expand=True)
def user_dashboard_request_view(request, **kwargs):
    """User dashboard request details view.

    Note:
        This function was adapted from Invenio App RDM to fit the
        GEO Knowledge Hub requirements.
    """
    # Base definitions
    identity = g.identity

    avatar = current_user_resources.users_service.links_item_tpl.expand(
        g.identity, current_user
    )["avatar"]

    request_type = request["type"]

    is_draft_submission = request_type == CommunitySubmission.type_id
    is_invitation = request_type == CommunityInvitation.type_id
    is_assistance = "assistance" in request_type
    is_preview = not is_assistance

    request_is_accepted = request["status"] == AcceptAction.status_to

    # Loading services based on record type
    record_type = list(request["topic"].keys())
    record_type = record_type[0]

    # handling "various types" of packages (e.g., 'package draft' or 'package record')
    is_knowledge_package = "package" in record_type
    record_type = "package" if is_knowledge_package else record_type

    service = get_record_service(record_type)
    files_service = get_files_service(record_type)
    draft_files_service = get_draft_files_service(record_type)

    if is_draft_submission or is_assistance:
        # Getting related data for packages and resources
        related_records_metadata = []
        related_package_metadata = []
        engagement_priorities = []
        programme_activity = []
        record_tags = []
        user_stories = []
        package_requests = []

        topic = requests_utilities.resolve_topic(
            request, service, draft=is_draft_submission
        )
        record = topic["record_ui"]
        files = requests_utilities.resolve_record_or_draft_files(
            record, files_service, draft_files_service
        )

        if record:  # when accepted, the request don't return the record object.
            if record_type == "package":  # Especial validation for packages
                # Expanding package metadata
                (
                    engagement_priorities,
                    programme_activity,
                    record_tags,
                    user_stories,
                    related_records_metadata,
                ) = metadata_utilities.expand_metadata_from_package(identity, record)

            elif record_type == "record":
                # Expanding record metadata
                (
                    engagement_priorities,
                    programme_activity,
                    record_tags,
                    related_package_metadata,
                ) = metadata_utilities.expand_metadata_from_record(identity, record)

        # Defining template
        template = (
            "invenio_requests/request-submission/index.html"
            if is_assistance
            else "invenio_requests/community-submission/index.html"
        )

        return render_template(
            template,
            base_template="invenio_app_rdm/users/base.html",
            user_avatar=avatar,
            invenio_request=request.to_dict(),
            record=record,
            permissions=topic["permissions"],
            is_preview=is_preview,
            draft_is_accepted=request_is_accepted,
            files=files,
            is_user_dashboard=True,
            programme_activity=programme_activity,
            record_tags=record_tags,
            user_stories=user_stories,
            is_knowledge_package=is_knowledge_package,
            related_package_information=related_package_metadata,
            related_elements_information=related_records_metadata,
            related_engagement_priorities=engagement_priorities,
            custom_fields_ui=load_custom_fields()["ui"],
        )

    elif is_invitation:
        return render_template(
            "invenio_requests/community-invitation/user_dashboard.html",
            base_template="invenio_app_rdm/users/base.html",
            user_avatar=avatar,
            invenio_request=request.to_dict(),
            invitation_accepted=request_is_accepted,
        )


@login_required
@pass_request(expand=True)
@pass_community(serialize=True)
def community_dashboard_request_view(request, community, community_ui, **kwargs):
    """Community dashboard requests details view."""
    # Base definitions
    identity = g.identity

    avatar = current_user_resources.users_service.links_item_tpl.expand(
        g.identity, current_user
    )["avatar"]

    request_type = request["type"]

    is_draft_submission = request_type == CommunitySubmission.type_id
    is_invitation = request_type == CommunityInvitation.type_id

    request_is_accepted = request["status"] == AcceptAction.status_to

    # Loading services based on record type
    record_type = list(request["topic"].keys())
    record_type = record_type[0]

    # handling "various types" of packages (e.g., 'package draft' or 'package record')
    is_knowledge_package = "package" in record_type
    record_type = "package" if is_knowledge_package else record_type

    service = get_record_service(record_type)
    files_service = get_files_service(record_type)
    draft_files_service = get_draft_files_service(record_type)

    if is_draft_submission:
        # Getting related data for packages and resources
        related_records_metadata = []
        related_package_metadata = []
        engagement_priorities = []
        programme_activity = []
        record_tags = []
        user_stories = []
        package_requests = []
        files = []

        topic = requests_utilities.resolve_topic(
            request, service, draft=is_draft_submission
        )
        record = topic["record_ui"]

        if files_service and draft_files_service:
            files = requests_utilities.resolve_record_or_draft_files(
                record, files_service, draft_files_service
            )

        if record:  # when accepted, the request don't return the record object.
            if record_type == "package":  # Especial validation for packages
                # Expanding package metadata
                (
                    engagement_priorities,
                    programme_activity,
                    record_tags,
                    user_stories,
                    related_records_metadata,
                ) = metadata_utilities.expand_metadata_from_package(identity, record)

            elif record_type == "record":
                # Expanding record metadata
                (
                    engagement_priorities,
                    programme_activity,
                    record_tags,
                    related_package_metadata,
                ) = metadata_utilities.expand_metadata_from_record(identity, record)

        permissions = community.has_permissions_to(
            ["update", "read", "search_requests", "search_invites"]
        )

        return render_template(
            "invenio_requests/community-submission/index.html",
            base_template="invenio_communities/details/base.html",
            user_avatar=avatar,
            invenio_request=request.to_dict(),
            record=record,
            community=community_ui,
            permissions=permissions,
            is_preview=True,
            draft_is_accepted=request_is_accepted,
            files=files,
            is_user_dashboard=True,
            programme_activity=programme_activity,
            record_tags=record_tags,
            user_stories=user_stories,
            is_knowledge_package=is_knowledge_package,
            related_package_information=related_package_metadata,
            related_elements_information=related_records_metadata,
            related_engagement_priorities=engagement_priorities,
            custom_fields_ui=load_custom_fields()["ui"],
        )

    elif is_invitation:
        permissions = community.has_permissions_to(
            ["update", "read", "search_requests", "search_invites"]
        )
        if not permissions["can_search_invites"]:
            raise PermissionDeniedError()

        return render_template(
            "invenio_requests/community-invitation/community_dashboard.html",
            base_template="invenio_communities/details/members/base.html",
            permissions=permissions,
            invenio_request=request.to_dict(),
            community=community.to_dict(),
            invitation_accepted=request_is_accepted,
            user_avatar=avatar,
        )
