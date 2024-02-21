# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Metadata utilities."""

from geo_knowledge_hub.modules.base.utilities import metadata as metadata_utilities


def expand_metadata(identity, record, record_type):
    """Expand metadata from a record.

    Args:
        identity (flask_principal.Identity): User identity

        record (dict): Base record metadata.

        record_type (str): Type of the record.

    Returns:
        dict: record metadata expanded.
    """
    strategy = {
        "package": metadata_utilities.expand_metadata_from_package,
        "record": metadata_utilities.expand_metadata_from_record,
        "marketplace-item": metadata_utilities.expand_metadata_from_marketplace_item,
    }

    return strategy.get(record_type)(identity, record)
