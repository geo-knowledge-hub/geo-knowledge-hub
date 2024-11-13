# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Vocabulary utilities functions."""

from invenio_vocabularies.proxies import current_service as vocabulary_service
from pydash import py_


def get_resource_type_definitions(identity, limit=100):
    """Get resource types available in the instance.

    Args:
        identity (flask_principal.Identity): Identity object.

        limit (int): Max number of resource types to return.

    Returns:
        list: List of resource types available in the instance.
    """

    # load resource types
    resource_types = vocabulary_service.search(
        identity=identity, type="resourcetypes", size=limit
    )
    resource_types = py_.get(resource_types.to_dict(), "hits.hits", [])

    # mutate resource types
    resource_types = py_.map(
        resource_types,
        lambda x: dict(
            id=py_.get(x, "id"),
            icon=py_.get(x, "icon"),
            type_name=py_.replace(py_.get(x, "props.type", ""), "-", " ").title(),
        ),
    )

    return resource_types
