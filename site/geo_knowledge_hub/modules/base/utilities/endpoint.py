# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Endpoint utilities."""


def generate_marketplace_item_endpoint():
    """Generate endpoints from Marketplace Item.

    Returns:
        dict: record endpoints.
    """
    return dict(
        files_preview_endpoint="geokhub_marketplace_ui_bp.geokhub_marketplace_file_preview",
        files_download_endpoint="geokhub_marketplace_ui_bp.geokhub_marketplace_file_download",
        export_endpoint="geokhub_marketplace_ui_bp.geokhub_marketplace_item_export",
    )


def generate_package_endpoint():
    """Generate endpoints from Package.

    Returns:
        dict: record endpoints.
    """
    return dict(
        # Files
        files_preview_endpoint="geokhub_packages_ui_bp.record_file_preview",
        files_download_endpoint="geokhub_packages_ui_bp.record_file_download",
        # Export
        export_endpoint="geokhub_packages_ui_bp.geokhub_package_export",
    )


def generate_record_endpoint():
    """Generate endpoints from Record.

    Returns:
        dict: record endpoints.
    """
    return dict(
        # Files
        files_preview_endpoint="invenio_app_rdm_records.record_file_preview",
        files_download_endpoint="invenio_app_rdm_records.record_file_download",
        # Export
        export_endpoint="geokhub_records_ui_bp.geokhub_record_export",
    )
