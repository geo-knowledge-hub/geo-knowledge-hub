#!/bin/sh
#
# This file is part of GEO Knowledge Hub.
# Copyright 2020-2021 GEO Secretariat.
#
# GEO Knowledge Hub is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
#

# Code adapted from: https://github.com/verdaccio/github-actions/blob/542a16f7f37777ff3c73f5de2bb1ed14051b6e20/publish/entrypoint.sh

set -e

# start local registry
sh -c "verdaccio --config /verdaccio/config/config.yaml"
