# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Related records."""

from .records import serializer_dump_records


def more_like_this_record(identity, record_id, service, size):
    """Function to search related records.

    Args:
        identity: User identity.

        record_id (str): Record ID.

        service (geo_rdm_records.base.services.search.BaseRelatedRecordsSearchService): Search service.

        size (int): Number of related records to retrieve.

    Returns:
        Union[List[Dict], List[None]]: List of related records.
    """
    records = service.search_more_like_this(identity, record_id, size=size)

    return serializer_dump_records(records)
