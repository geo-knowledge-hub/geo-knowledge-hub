# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Video previewer."""

from pathlib import Path

from flask import render_template
from invenio_previewer.proxies import current_previewer

previewable_extensions = ["mp4", "webm", "ogg"]


def can_preview(file):
    """Determine if the given file can be previewed."""
    supported_extensions = (".mp4", ".webm", ".ogg")
    return file.has_extensions(*supported_extensions)


def preview(file):
    """Render the appropriate template with embed flag."""
    # extracting file extension
    # ToDo: Maybe, `PreviewFile` (Invenio App RDM) can provides a
    #       `extension` or `type` attribute with the file extension.
    extension = Path(file.filename).suffix.replace(".", "")

    return render_template(
        "semantic-ui/invenio_previewer/simple_video.html",
        file=file,
        extension=extension,
        js_bundles=current_previewer.js_bundles,
        css_bundles=current_previewer.css_bundles,
    )
