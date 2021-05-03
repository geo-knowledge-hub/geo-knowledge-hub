# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Module tests."""

from flask import Flask

from gkhext import GKHubExt


def test_version():
    """Test version import."""
    from gkhext import __version__
    assert __version__


def test_init():
    """Test extension initialization."""
    app = Flask('testapp')
    ext = GKHubExt(app)
    assert 'geo-knowledge-hub-ext' in app.extensions

    app = Flask('testapp')
    ext = GKHubExt()
    assert 'geo-knowledge-hub-ext' not in app.extensions
    ext.init_app(app)
    assert 'geo-knowledge-hub-ext' in app.extensions


def test_view(base_client):
    """Test view."""
    res = base_client.get("/")
    assert res.status_code == 200
    assert 'Welcome to geo-knowledge-hub-ext' in str(res.data)
