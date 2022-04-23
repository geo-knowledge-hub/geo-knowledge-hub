# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Module tests."""

from flask import Flask

from geo_knowledge_hub import GeoKnowledgeHub


def test_version():
    """Test version import."""
    from geo_knowledge_hub import __version__

    assert __version__


def test_init():
    """Test extension initialization."""
    app = Flask("testapp")
    ext = GeoKnowledgeHub(app)
    assert "geo-knowledge-hub" in app.extensions

    app = Flask("testapp")
    ext = GeoKnowledgeHub()
    assert "geo-knowledge-hub" not in app.extensions
    ext.init_app(app)
    assert "geo-knowledge-hub" in app.extensions
