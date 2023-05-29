# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Packages UI record toolbox."""


def check_requests(record, request_types):
    """Check which type of request has made for the record."""
    res = {}
    for request_type in request_types:
        res[request_type] = any(
            map(lambda x: x["type"] == request_type, record["assistance_requests"])
        )

    return res
