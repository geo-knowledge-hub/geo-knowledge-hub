# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Request module."""

from flask import g
from flask_login import current_user
from geo_rdm_records.base.resources.serializers import (
    UIRecordJSONSerializer as UIJSONSerializer,
)
from invenio_requests.resolvers.registry import ResolverRegistry
from sqlalchemy.orm.exc import NoResultFound


def resolve_record_or_draft_files(record, files_service, draft_files_service):
    """Resolve the record's or draft's files."""
    if record and record["files"]["enabled"]:
        record_pid = record["id"]
        try:
            files = draft_files_service.list_files(id_=record_pid, identity=g.identity)
        except NoResultFound:
            files = files_service.list_files(id_=record_pid, identity=g.identity)
        return files.to_dict()
    return None


def resolve_topic_draft(request, service):
    """Resolve the record in the topic when it is a draft."""
    user_owns_request = str(request["expanded"]["created_by"]["id"]) == str(
        current_user.id
    )

    if request["is_closed"] and not user_owns_request:
        return dict(permissions={}, record_ui=None)

    recid = ResolverRegistry.resolve_entity_proxy(request["topic"])._parse_ref_dict_id()

    try:
        record = service.read_draft(g.identity, recid, expand=True)
        record_ui = UIJSONSerializer().dump_obj(record.to_dict())
        permissions = record.has_permissions_to(
            [
                "edit",
                "new_version",
                "manage",
                "update_draft",
                "read_files",
                "review",
            ]
        )

        return dict(permissions=permissions, record_ui=record_ui)

    except NoResultFound:
        # record tab not displayed when the record is not found
        # the request is probably not open anymore
        pass

    return dict(permissions={}, record_ui=None)
