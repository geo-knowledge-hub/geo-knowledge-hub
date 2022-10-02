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
from invenio_records_resources.services.errors import PermissionDeniedError
from sqlalchemy.orm.exc import NoResultFound

from .registry import get_draft_files_service, get_files_service, get_record_service


#
# Decorators
#
def pass_record_files(record_type):
    """Record argument decorator factory.

    Note:
        This decorator was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """

    def decorator(f):
        """Decorate a view to pass a record's files using the files service."""

        @wraps(f)
        def view(**kwargs):
            is_preview = kwargs.get("is_preview")

            def list_record_files():
                """List record files."""
                return get_files_service(record_type).list_files(
                    id_=pid_value, identity=g.identity
                )

            try:
                pid_value = kwargs.get("pid_value")
                if is_preview:
                    try:
                        files = get_draft_files_service(record_type).list_files(
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
    """Decorator to retrieve the draft using the record service.

    Note:
        This decorator was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """

    def decorator(f):
        @wraps(f)
        def view(**kwargs):
            pid_value = kwargs.get("pid_value")
            draft = get_record_service(record_type).read_draft(
                id_=pid_value,
                identity=g.identity,
                expand=expand,
            )
            kwargs["draft"] = draft
            return f(**kwargs)

        return view

    return decorator


def pass_draft_files(record_type):
    """Draft files argument decorator factory.

    Note:
        This decorator was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """

    def decorator(f):
        """Decorate a view to pass a draft's files using the files service."""

        @wraps(f)
        def view(**kwargs):
            try:
                pid_value = kwargs.get("pid_value")
                files = get_draft_files_service(record_type).list_files(
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


def pass_record_or_draft(record_type, expand=False):
    """Decorate to retrieve the record or draft using the record service.

    Note:
        This decorator was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """

    def decorator(f):
        @wraps(f)
        def view(**kwargs):
            pid_value = kwargs.get("pid_value")
            is_preview = kwargs.get("is_preview")

            def get_record():
                """Retrieve record."""
                return get_record_service(record_type).read(
                    id_=pid_value, identity=g.identity, expand=expand
                )

            if is_preview:
                try:
                    record = get_record_service(record_type).read_draft(
                        id_=pid_value, identity=g.identity, expand=expand
                    )
                except NoResultFound:
                    record = get_record()
            else:
                record = get_record()
            kwargs["record"] = record
            return f(**kwargs)

        return view

    return decorator


def pass_file_item(record_type):
    """Decorate a view to pass a file item using the files service.

    Note:
        This decorator was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """

    def decorator(f):
        @wraps(f)
        def view(**kwargs):
            pid_value = kwargs.get("pid_value")
            file_key = kwargs.get("filename")
            is_preview = kwargs.get("is_preview")

            def get_record_file_content():
                """Retrieve record file content."""
                return get_files_service(record_type).get_file_content(
                    id_=pid_value, file_key=file_key, identity=g.identity
                )

            if is_preview:
                try:
                    item = get_draft_files_service(record_type).get_file_content(
                        id_=pid_value, file_key=file_key, identity=g.identity
                    )
                except NoResultFound:
                    item = get_record_file_content()
            else:
                item = get_record_file_content()
            kwargs["file_item"] = item
            return f(**kwargs)

        return view

    return decorator


def pass_file_metadata(record_type):
    """Decorate a view to pass a file item using the files service.

    Note:
        This decorator was adapted from Invenio RDM Records to fit
        the GEO Knowledge Hub requirements.
    """

    def decorator(f):
        """Decorate a view to pass a file's metadata using the files service."""

        @wraps(f)
        def view(**kwargs):
            pid_value = kwargs.get("pid_value")
            file_key = kwargs.get("filename")
            is_preview = kwargs.get("is_preview")

            def get_record_file_content():
                """Retrieve record file metadata."""
                return get_files_service(record_type).read_file_metadata(
                    id_=pid_value, file_key=file_key, identity=g.identity
                )

            if is_preview:
                try:
                    files = get_draft_files_service(record_type).read_file_metadata(
                        id_=pid_value, file_key=file_key, identity=g.identity
                    )
                except NoResultFound:
                    files = get_record_file_content()
            else:
                files = get_record_file_content()
            kwargs["file_metadata"] = files
            return f(**kwargs)

        return view

    return decorator
