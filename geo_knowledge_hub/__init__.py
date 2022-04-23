# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub customization module for InvenioRDM."""

from .ext import GeoKnowledgeHub
from .version import __version__

__all__ = ("__version__", "GeoKnowledgeHub")
