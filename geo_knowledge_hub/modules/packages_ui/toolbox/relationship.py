# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Package relationship module."""

from typing import List

from invenio_records.api import Record

from geo_knowledge_hub.modules.base.records import read_record


def get_related_records_metadata(identity, record: Record) -> List:
    """Controller to get related resources from a record metadata.

    Args:
        identity (flask_principal.Identity): User identity

        record (Record): Package as Record API Object.

    Returns:
        List: List with metadata from related resources
    """
    related_records = []
    record_relationships = record["relationship"]

    for relationship_type in record_relationships.keys():

        record_relations = record_relationships[relationship_type]

        for relationship in record_relations:
            record_related_pid = relationship["id"]

            # Packages are only related to "packages". So, we need to
            # use the "record" service.
            record_related = read_record(identity, record_related_pid, "record")
            related_records.append(record_related)

    return related_records
