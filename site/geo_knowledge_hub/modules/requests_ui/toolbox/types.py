# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Type utilities."""


def resolve_resource_type(request):
    """Extract record type from a request."""
    record_type = list(request["topic"].keys())
    record_type = record_type[0]

    # special rule: Knowledge Packages
    is_package = "package" in record_type
    record_type = "package" if is_package else record_type

    return record_type.replace("_", "-")
