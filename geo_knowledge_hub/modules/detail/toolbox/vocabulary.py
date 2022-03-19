# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_
from typing import List

from flask import url_for

from invenio_records.api import Record
from invenio_vocabularies.proxies import current_service as vocabulary_service

from invenio_access.permissions import system_identity


def get_engagement_priority_from_record(record: Record, ep_vocabularies: List = []):
    """Retrieve the Engagement Priority metadata associated with a record.

    Since the InvenioRDM don't support the definition of a custom fields, in this
    version of the GEO Knowledge Hub module, we are using the subject fields to store
    our data. In a future implementation, this will be replaced by the InvenioRDM custom
    fields.

    Args:
        record (Record): Invenio Record object.

        ep_vocabularies (List): List Engagement Priorities vocabularies schemes used
                                in the objects.
    """
    # getting the engagement priority topics
    result = []

    record_subjects = py_.get(record, "metadata.subjects", None)
    record_subjects = (
        py_.chain(record_subjects)
        .filter(
            lambda x: x.get("scheme") in ep_vocabularies if ep_vocabularies else True
        )
        .map(lambda x: x.get("id"))
        .uniq()
        .value()
    )

    if record_subjects:
        record_subjects = (
            " OR ".join(py_.map(record_subjects, lambda x: f"id:{x}"))
            if record_subjects
            else ""
        )

        # searching for the topics
        engagement_priorities_topics = vocabulary_service.search(
            identity=system_identity,
            params={"q": record_subjects},
            type="engagementprioritiestopics",
        ).to_dict()

        # returing and setting the static url
        # (temporary: in the future, we will
        # use the bundled files!)
        result = py_.compact(
            py_.map(
                py_.get(engagement_priorities_topics, "hits.hits", []),
                lambda x: py_.set_(
                    x, "props.icon", url_for("static", filename=x["props"]["icon"])
                ),
            ),
        )
    return result
