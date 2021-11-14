# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from flask import Blueprint


def generate_bp(app):
    """Generate the base extension blueprint."""
    return Blueprint("geo_knowledge_hub", __name__)


__all__ = (
    "generate_bp"
)
