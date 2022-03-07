# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_

from typing import List

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
    record_subjects = py_.get(record, "metadata.subjects")
    record_subjects = (
        py_.chain(record_subjects)
        .filter(
            lambda x: x.get("scheme") in ep_vocabularies if ep_vocabularies else True
        )
        .map(lambda x: x.get("id"))
        .uniq()
        .value()
    )

    if not record_subjects:
        # ToDo: This don't make sense! We don't need do the search to create a result object!
        #       Maybe, this function can encapsulate the result.
        record_subjects = "idfoo:foo"
    else:
        # preparing the elasticsearch query
        record_subjects = " OR ".join(py_.map(record_subjects, lambda x: f"id:{x}"))

    # searching for the topics
    engagement_priorities_topics = vocabulary_service.search(
        identity=system_identity,
        params={"q": record_subjects},
        type="engagementprioritiestopics",
    )

    # # now, we can get the engagement priority theme itself
    # engagement_priorities_themes = (
    #     py_.chain(engagement_priorities_topics)
    #     .map(lambda x: py_.get(x, "props.engagement_priority"))
    #     .uniq()
    #     .value()
    # )

    # engagement_priorities_themes = " OR ".join(
    #     py_.map(engagement_priorities_themes, lambda x: f"id:{x}")
    # )
    # engagement_priorities_themes = vocabulary_service.search(
    #     identity=system_identity,
    #     params={"q": engagement_priorities_themes},
    #     type="engagementpriorities",
    # )

    return engagement_priorities_topics  # engagement_priorities_themes
