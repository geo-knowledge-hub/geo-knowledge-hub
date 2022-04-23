# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Front (page) toolbox."""

from invenio_vocabularies.proxies import current_service as vocabulary_service

from invenio_access.permissions import system_identity


def get_engagement_priority_topics_available(**kwargs):
    """Retrieve the Engagement Priorities topics metadata available into the GEO Knowledge Hub.
    Args:
        **kwargs: Extra parameters to the vocabulary service `search` method.
    """
    engagement_priorities_topics = vocabulary_service.search(
        identity=system_identity, type="engagementprioritiestypes", **kwargs
    )

    return engagement_priorities_topics
