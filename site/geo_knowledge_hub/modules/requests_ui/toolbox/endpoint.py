# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Endpoint utilities."""


from geo_knowledge_hub.modules.base.utilities import endpoint as endpoint_utilities


def generate_endpoint(record_type):
    """Generate endpoints for a given type of record.

    Args:
        record_type (str): Type of the record.

    Returns:
        dict: record endpoints.
    """
    strategy = {
        "package": endpoint_utilities.generate_package_endpoint(),
        "record": endpoint_utilities.generate_record_endpoint(),
        "marketplace-item": endpoint_utilities.generate_marketplace_item_endpoint(),
    }

    return strategy.get(record_type)
