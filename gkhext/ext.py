# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

from typing import Dict
from typing import List

from flask_babelex import gettext as _
from invenio_records_resources.services import FileService

from . import config
from .records.config import GeoRecordFilesServiceConfig, GeoDraftFilesServiceConfig
from .records.config import GeoRecordServiceConfig
from .security.policies import GeoRecordPermissionPolicy


def add_new_view_to_app(app, views: List[Dict], **kwargs):
    """add a new url_rul to a Flask App

    Usage:

    >> app = Flask(__name__)
    >> my_new_views = { "endpoint": "/my-endpoint", "name": "medp", "func": endpoint.function }
    >> add_new_view_to_app(app, my_new_views)

    Args:
        app (Flask): Flask app instance

        views (List[Dict]): Definition of each view. This is a list of dictionary with
        "endpoint", "name" and "func" keys

        kwargs (dict): args for add_url_rule function

    Returns:
        None
    """

    for view in views:
        app.add_url_rule(*view.values(), **kwargs)


def obj_or_import_string(value, default=None):
    """Import string or return object.
    :params value: Import path or class object to instantiate.
    :params default: Default object to return if the import fails.
    :returns: The imported object.
    """
    import six
    from werkzeug.utils import import_string

    if isinstance(value, six.string_types):
        return import_string(value)
    elif value:
        return value
    return default


class GKHubExt(object):
    """geo-knowledge-hub-ext extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        # TODO: This is an example of translation string with comment. Please
        # remove it.
        # NOTE: This is a note to a translator.
        _('A translation string')
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""

        self.init_config(app)
        self.init_services(app)
        self.init_geo_pages(app)
        self.init_overwritten_pages(app)

        app.extensions['geo-knowledge-hub-ext'] = self

    def init_overwritten_pages(self, app):
        """Override Invenio RDM pages with Geo permissions"""

        from .views import communities_views

        # add_new_view_to_app(app, deposit_views)
        add_new_view_to_app(app, communities_views)

    def init_geo_pages(self, app):
        """Add Geo Knowledge Pages in app instance"""

        from .views import record_detail_page_render, request_access_view

        app.add_url_rule("/records/<pid_value>", "record_detail", record_detail_page_render)
        app.add_url_rule("/request-access", "request_access_page", request_access_view, methods=[
            "GET", "POST"
        ])

    def _filter_record_service_config(self, app, service_config_cls):
        """Filter record service config based on app global config."""
        if not app.config["RDM_RECORDS_DOI_DATACITE_ENABLED"]:
            service_config_cls.pids_providers.pop("doi", None)
        return service_config_cls

    def init_services(self, app):
        """Initialize services."""

        from invenio_rdm_records.services import RDMRecordService

        service_config = GeoRecordServiceConfig
        service_config.permission_policy_cls = obj_or_import_string(
            app.config.get("RECORDS_PERMISSIONS_RECORD_POLICY"),
            default=GeoRecordPermissionPolicy
        )

        self.records_service = RDMRecordService(
            config=self._filter_record_service_config(app, service_config),
            files_service=FileService(GeoRecordFilesServiceConfig),
            draft_files_service=FileService(GeoDraftFilesServiceConfig)
        )

    def init_config(self, app):
        """Initialize configuration."""
        # Use theme's base template if theme is installed
        if 'BASE_TEMPLATE' in app.config:
            app.config.setdefault(
                'GEO_KNOWLEDGE_HUB_EXT_BASE_TEMPLATE',
                app.config['BASE_TEMPLATE'],
            )
        for k in dir(config):
            if k.startswith('GEO_KNOWLEDGE_HUB_EXT_'):
                app.config.setdefault(k, getattr(config, k))
