# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Detail (page) toolbox."""

from functools import wraps

from flask import g
from geo_rdm_records.proxies import current_geo_packages_service
from invenio_rdm_records.proxies import current_rdm_records_service
from invenio_records_resources.services.errors import PermissionDeniedError
from sqlalchemy.orm.exc import NoResultFound


#
# Services
#
class ServiceRegistry:
    """Record service registry."""

    services = {
        "resource": current_rdm_records_service,
        "package": current_geo_packages_service,
    }

    @classmethod
    def get_service(cls, record_type):
        """Get service by record type."""
        return cls.services[record_type]


def service(record_type):
    """Record service factory."""
    return ServiceRegistry.get_service(record_type)


def files_service(record_type):
    """Files record service factory."""
    base_service = ServiceRegistry.get_service(record_type)
    return base_service.files


def draft_files_service(record_type):
    """(Draft) Files record service factory."""
    base_service = ServiceRegistry.get_service(record_type)
    return base_service.draft_files


#
# Decorators
#
def pass_record_files(record_type):
    """Record argument decorator factory."""

    def decorator(f):
        """Decorate a view to pass a record's files using the files service."""

        @wraps(f)
        def view(**kwargs):
            is_preview = kwargs.get("is_preview")

            def list_record_files():
                """List record files."""
                return files_service(record_type).list_files(
                    id_=pid_value, identity=g.identity
                )

            try:
                pid_value = kwargs.get("pid_value")
                if is_preview:
                    try:
                        files = draft_files_service(record_type).list_files(
                            id_=pid_value, identity=g.identity
                        )
                    except NoResultFound:
                        files = list_record_files()
                else:
                    files = list_record_files()
                kwargs["files"] = files

            except PermissionDeniedError:
                # this is handled here because we don't want a 404 on the landing
                # page when a user is allowed to read the metadata but not the
                # files
                kwargs["files"] = None

            return f(**kwargs)

        return view

    return decorator


def pass_draft(record_type, expand=False):
    """Decorator to retrieve the draft using the record service."""

    def decorator(f):
        @wraps(f)
        def view(**kwargs):
            pid_value = kwargs.get("pid_value")
            draft = service(record_type).read_draft(
                id_=pid_value,
                identity=g.identity,
                expand=expand,
            )
            kwargs["draft"] = draft
            return f(**kwargs)

        return view

    return decorator


def pass_draft_files(record_type):
    """Draft files argument decorator factory."""

    def decorator(f):
        """Decorate a view to pass a draft's files using the files service."""

        @wraps(f)
        def view(**kwargs):
            try:
                pid_value = kwargs.get("pid_value")
                files = draft_files_service(record_type).list_files(
                    id_=pid_value, identity=g.identity
                )
                kwargs["draft_files"] = files

            except PermissionDeniedError:
                # this is handled here because we don't want a 404 on the landing
                # page when a user is allowed to read the metadata but not the
                # files
                kwargs["draft_files"] = None

            return f(**kwargs)

        return view

    return decorator
