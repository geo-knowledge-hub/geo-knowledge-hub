# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from invenio_vocabularies.proxies import current_service as vocabulary_service

from invenio_access.permissions import system_identity


def get_engagement_priority_topics_available():
    """Retrieve the Engagement Priorities topics metadata available
    in the GEO Knowledge Hub.
    """
    engagement_priorities_topics = vocabulary_service.search(
        identity=system_identity,
        type="engagementprioritiestopics",
    )

    return engagement_priorities_topics
