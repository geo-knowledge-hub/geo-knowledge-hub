# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Award configuration utilities.."""


from pydash import py_

from geo_knowledge_hub.modules.base.config import load_from_config


def get_configurations():
    """Load extra configurations for awards."""
    extra_funding_config = load_from_config("GKH_DEPOSIT_FUNDING_CONFIG")

    return py_.get(extra_funding_config, "awards", {})
