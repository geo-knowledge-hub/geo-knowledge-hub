# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

from typing import Dict
from typing import List

from .services import get_related_resource_information


def get_related_resources_metadata(record_metadata: Dict) -> List:
    """Controller to get related resources from a record metadata

    Args:
        record_metadata (Dict): Metadata from a Record

    Returns:
        List: List with metadata from related resources
    """

    if "related_identifiers" not in record_metadata:
        return []

    related_resources_metadata = []
    related_identifiers = record_metadata["related_identifiers"]

    for related_record in related_identifiers:
        record_details: Dict = get_related_resource_information(related_record)
        related_resources_metadata.append(record_details)
    return related_resources_metadata
