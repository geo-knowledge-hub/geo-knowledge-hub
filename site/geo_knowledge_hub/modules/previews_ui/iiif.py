# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2024 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Simple IIIF image previewer."""

from flask import current_app
from invenio_app_rdm.records_ui.previewer.iiif_simple import preview as base_preview
from werkzeug.local import LocalProxy

previewable_extensions = LocalProxy(lambda: current_app.config["IIIF_FORMATS"].keys())


#
# Auxiliary functions
#
def can_open_without_bomb_error(file, max_pixels=178956970):
    """
    Check if an image file can be opened without causing a 'PIL.Image.DecompressionBombError' error.

    Args:
        file (PreviewFile): PreviewFile object

        max_pixels (int): Maximum number of pixels allowed for the image. Default is set to `178956970`, which is the
                          default in Pillow.

    Returns:
        Bool: Flag indicating if the file can be open without `DecompressionBombError`.
    """
    width = file.data["metadata"]["width"]
    height = file.data["metadata"]["height"]

    return not ((width * height) > max_pixels)


#
# Previewer
#
# This code is an adaptation of the Invenio App RDM.
# In the GEO Knowledge Hub, some users upload GeoTiff files. IIIF can be used to preview them.
# But, for some cases, the GeoTiff is huge (> 4GB). To avoid errors, we adapted the `simple_iiif` to don't
# preview bug files (`.tiff` > 4GB).
preview = base_preview


def can_preview(file):
    """Check if file can be previewed by this previewer.

    :param file: The file to be previewed.
    :returns: Boolean
    """
    # supported_extensions list needs . prefixed -
    supported_extensions = ["." + ext for ext in previewable_extensions]

    # check the number of bytes
    is_managable = can_open_without_bomb_error(file)

    return file.has_extensions(*supported_extensions) and is_managable
