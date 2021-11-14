# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Proxy definitions."""

from flask import current_app
from werkzeug.local import LocalProxy

current_geo_knowledge_hub = LocalProxy(
    lambda: current_app.extensions["geo-knowledge-hub"])
"""Proxy to the extension."""
