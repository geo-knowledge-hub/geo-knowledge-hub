# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from flask import Blueprint


def init_bp(app):
    return Blueprint("geo_base_bp", __name__, template_folder="theme/templates")


__all__ = (
    "init_bp"
)
