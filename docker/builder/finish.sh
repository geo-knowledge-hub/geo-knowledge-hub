#!/bin/bash
#
# This file is part of GEO Knowledge Hub.
# Copyright 2020-2021 GEO Secretariat.
#
# GEO Knowledge Hub is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
#

#
# 1. Stopping the services
#
docker-compose -f docker/builder/docker-compose.yml down
