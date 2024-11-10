# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Harvest utilities."""

import requests
from flask import current_app
from pydash import py_

from geo_knowledge_hub.modules.base.utilities import files as files_utilities


#
# Sources config
#
def get_source_config(source_name):
    """Get source configuration (e.g., Name, Logo, API addresses).

    Args:
        source_name (str): Source name.

    Returns:
        dict: Source configuration object.
    """
    sources_config = current_app.config.get("GKH_SOURCES_CONFIG", {})

    return sources_config.get(source_name, None)


def get_source_config_from_record(record):
    """Get record source configuration (e.g., Name, Logo, API addresses).

    Args:
        record (dict): Record object (including parents, metadata and other keys).

    Returns:
        dict: Source configuration object.
    """
    source_name = py_.get(record, "parent.harvester.origin.name")

    return get_source_config(source_name)


#
# Harvest address
#
def get_record_address(record):
    """Get record address in the original source.

    Args:
        record (dict): Record object (including parents, metadata and other keys).

    Returns:
        Union[str, None]: Record address or none.
    """
    # get configurations
    record_id = py_.get(record, "parent.harvester.origin.id")
    source_config = get_source_config_from_record(record)

    # define default address
    record_address = None

    if source_config:
        record_address = py_.get(source_config, "service.record")

        record_address = record_address.format(record_id=record_id)

    return record_address


#
# Harvest files - External files source strategies
#
def zenodo_get_files(record):
    """Get files from a Zenodo record.

    Args:
        record (dict): Record object (including parents, metadata and other keys).

    Returns:
        Union[Dict, None]: External files reference.
    """
    # read source configuration
    source_config = get_source_config_from_record(record)

    # zenodo definitions
    zenodo_file_api = py_.get(source_config, "service.file_api")
    zenodo_file_preview = py_.get(source_config, "service.file_preview")
    zenodo_file_download = py_.get(source_config, "service.file_download")

    # get record definition
    zenodo_record_id = py_.get(record, "parent.harvester.origin.id")

    # read files
    zenodo_record_files = []

    try:
        remote_files = requests.get(zenodo_file_api.format(record_id=zenodo_record_id))
        remote_files.raise_for_status()

        remote_files = remote_files.json()
        remote_files_enabled = py_.get(remote_files, "enabled", False)

        if remote_files_enabled:
            zenodo_record_files = py_.get(remote_files, "entries", [])

    except:
        zenodo_record_files = []

    # mutate files
    zenodo_record_files_mutate = []

    for file in zenodo_record_files:
        # get base information
        file_result = py_.pick(
            file, ["key", "checksum", "size", "mimetype", "metadata"]
        )

        # extract file key
        file_key = py_.get(file, "key")

        # download url
        py_.set(
            file_result,
            "url_download",
            zenodo_file_download.format(record_id=zenodo_record_id, file_key=file_key),
        )

        # preview url
        preview_url = None

        if files_utilities.can_preview(file_result):
            # assuming GKH and Zenodo have compatible previewers
            preview_url = zenodo_file_preview.format(
                record_id=zenodo_record_id, file_key=file_key
            )

        py_.set(file_result, "url_preview", preview_url)

        # source
        py_.set(file_result, "source", "Zenodo")

        zenodo_record_files_mutate.append(file_result)

    return zenodo_record_files_mutate


#
# Harvest files - Strategy
#
class SourcesFile:
    """Strategy class to manage external files providers."""

    sources_strategy = {"zenodo": zenodo_get_files}
    """Sources strategies."""

    sources_supported = sources_strategy.keys()
    """Sources  supported."""

    @classmethod
    def get_source_strategy(cls, provider):
        """Get function to read content of a given source."""
        return cls.sources_strategy.get(provider)

    @classmethod
    def is_supported(cls, provider):
        """Check if a given source is supported."""
        return provider in cls.sources_supported


#
# High-level function
#
def get_external_files(record):
    """Read files from external source.

    Args:
        record (dict): Record object (including parents, metadata and other keys).

    Returns:
        Union[Dict, None]: External files reference.

    Note:
        External files are only available in harvested records (e.g., records from Zenodo).
    """
    files = []
    harvest_provider = py_.get(record, "parent.harvester.origin.name")

    # get provider strategy
    provider_strategy = SourcesFile.get_source_strategy(harvest_provider)

    if provider_strategy:
        files = provider_strategy(record)

    return files
