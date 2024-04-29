# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Video previewer."""

"""
This code to preview video using video.js was imported into the GEO Knowledge Hub prior to the launch of
InvenioRDM v12. So, we should revisit this code and remove it as soon as we update it to v12.

We thank all InvenioRDM colleagues.
"""

from pathlib import Path

from flask import current_app, render_template
from invenio_previewer.proxies import current_previewer

# The video file world is complex, because support depends on
# hardware, OS, software and browser. A reasonable choice of supported
# extensions (https://en.wikipedia.org/wiki/HTML5_video#Browser_support) that
# are least likely to lead to an unsupported warning for end-users are
# mp4 and webm files. However, this is made customizable per instance.
previewable_extensions = current_app.config.get("PREVIEWER_VIDEO_EXTS", ["mp4", "webm"])


def can_preview(file):
    """Determine if the given file can be previewed."""
    supported_extensions = (".mp4", ".webm")
    return file.has_extensions(*supported_extensions)


def preview(file):
    """Render the appropriate template with embed flag."""
    # extracting file extension
    # ToDo: Maybe, `PreviewFile` (Invenio App RDM) can provides a
    #       `extension` or `type` attribute with the file extension.
    extension = Path(file.filename).suffix.replace(".", "")

    data_setup = {
        "controls": True,
        "preload": "metadata",
        "fill": True,
        **current_app.config.get("PREVIEWER_VIDEO_DATA_SETUP", {}),
    }

    return render_template(
        "semantic-ui/invenio_previewer/simple_video.html",
        file=file,
        extension=extension,
        data_setup=data_setup,
        js_bundles=current_previewer.js_bundles + ["videojs_js.js"],
        css_bundles=current_previewer.css_bundles + ["videojs_css.css"],
    )
