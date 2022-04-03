# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_

from flask import url_for

from invenio_records.api import Record
from invenio_vocabularies.proxies import current_service as vocabulary_service

from invenio_access.permissions import system_identity


def get_engagement_priority_from_record(record: Record):
    """Retrieve the Engagement Priority metadata associated with a record."""
    # getting the engagement priority topics
    result = None

    record_engagement_priorities = py_.get(record, "metadata.engagement_priorities", [])
    record_engagement_priorities_ids = py_.map(
        record_engagement_priorities, lambda x: x["id"]
    )

    if record_engagement_priorities_ids:
        record_engagement_priorities = vocabulary_service.read_many(
            identity=system_identity,
            type="engagementprioritiestypes",
            ids=record_engagement_priorities_ids,
        ).to_dict()

        result = (
            py_.chain(record_engagement_priorities)
            .get("hits.hits", [])
            .filter(lambda x: py_.get(x, "props.icon") != "")
            .map(
                lambda x: py_.set_(
                    x,
                    "props.icon",
                    url_for("static", filename=py_.get(x, "props.icon")),
                ),
            )
        ).value()
    return result
