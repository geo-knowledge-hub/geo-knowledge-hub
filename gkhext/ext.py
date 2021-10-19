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

    Args:
        value (Union[object, str]): Import path or class object to instantiate.

        default (object): Default object to return if the import fails.
    Returns:
        object: The imported object.
    See:
        https://github.com/tu-graz-library/invenio-records-marc21/blob/master/invenio_records_marc21/ext.py#L35
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
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""

        self.init_config(app)
        self.init_services(app)
        self.init_geo_pages(app)
        self.init_extensions(app)
        self.init_overwritten_pages(app)

        app.extensions['geo-knowledge-hub-ext'] = self

    def init_overwritten_pages(self, app):
        """Initialize Invenio RDM overwritten pages with Geo Knowledge Hub permissions"""

        from .views import communities_views, deposit_views

        add_new_view_to_app(app, deposit_views)
        add_new_view_to_app(app, communities_views)

    def init_geo_pages(self, app):
        """Initialize Geo Knowledge Pages"""

        from .views import record_detail_page_render, request_access_view

        app.add_url_rule("/records/<pid_value>", "record_detail", record_detail_page_render)
        app.add_url_rule("/request-access", "request_access_page", request_access_view, methods=[
            "GET", "POST"
        ])

        from .views import communities_frontpage, front_page, \
            about_page, contribute_page, discover_page, engage_page
        app.add_url_rule("/communities/", "communities_frontpage", communities_frontpage)
        app.add_url_rule("/", "front_page", front_page)
        app.add_url_rule("/about", "about", about_page)
        app.add_url_rule("/contribute", "contribute", contribute_page)
        app.add_url_rule("/discover", "discover", discover_page)
        app.add_url_rule("/engage", "engage", engage_page)


    def _filter_record_service_config(self, app, service_config_cls):
        """Filter record service config based on app global config.
        See:
            https://github.com/inveniosoftware/invenio-rdm-records/blob/756d057ed0e922c2bea6030919dbe3e600c16608/invenio_rdm_records/ext.py#L96
        """

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

    def init_extensions(self, app):
        """Initialize extra extensions"""

        #
        # Flask-Discussion
        #
        from flask_discussion import Discussion

        _discussion = Discussion()
        _discussion.init_app(app)
