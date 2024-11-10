# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Files utilities."""
from os.path import splitext

from invenio_files_rest.models import ObjectVersion
from invenio_previewer.api import PreviewFile as PreviewFileLocal
from invenio_previewer.proxies import current_previewer
from pydash import py_


class PreviewFileRemote:
    """PreviewFile for remote files."""

    def __init__(self, pid, record, fileobj):
        """Initialize object."""
        self.file = fileobj
        self.pid = pid
        self.record = record

    @property
    def data(self):
        """Metadata property"""
        return self.file

    @property
    def size(self):
        """Get file size."""
        return py_.get(self.file, "size")

    @property
    def filename(self):
        """Get filename."""
        return py_.get(self.file, "key")

    def is_local(self):
        """Check if file is local."""
        # in this version, remote files are in external InvenioRDM
        # instances (e.g., zenodo). So, it is ok to force it to be `local`.
        return True

    def has_extensions(self, *exts):
        """Check if file has one of the extensions."""
        file_ext = splitext(self.filename)[1].lower()
        return file_ext in exts


def can_preview(file):
    """Check if a given file can be previewed.

    Args:
        filename (Union[dict, ObjectVersion]): File name.

    Returns:
        bool: True if file can be previewed. Otherwise, false.
    """
    # define preview file class
    file_cls = (
        PreviewFileLocal if isinstance(file, ObjectVersion) else PreviewFileRemote
    )

    # file object
    file_obj = file_cls(None, None, file)

    for plugin in current_previewer.iter_previewers():
        if plugin.can_preview(file_obj):
            return True

    return False
