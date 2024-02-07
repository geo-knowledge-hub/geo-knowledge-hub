# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub RDM module."""

from flask import Blueprint, redirect

from geo_knowledge_hub.modules.base.decorators import pass_record_from_pid


@pass_record_from_pid
def record_from_pid(record=None, **kwargs):
    """Redirect to record'l latest version page."""
    return redirect(record["links"]["self_html"], code=301)


def create_blueprint(app):
    """Initialize RDM module blueprint."""
    routes = app.config.get("APP_RDM_ROUTES")

    bp = Blueprint("geo_pid_bp", __name__)

    rdm_records_ext = app.extensions["invenio-rdm-records"]
    schemes = rdm_records_ext.records_service.config.pids_providers.keys()
    schemes = ",".join(schemes)
    if schemes:
        bp.add_url_rule(
            routes["record_from_pid"].format(schemes=schemes),
            view_func=record_from_pid,
        )

    @bp.before_app_first_request
    def adapt_pid_resolver_url():
        """Adapt PIDs Resolver to avoid url duplications."""
        app.url_map._rules_by_endpoint.pop(
            "invenio_app_rdm_records.record_from_pid", None
        )

    return bp
