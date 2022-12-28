# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""Integrity regularizer for GEO Knowledge Hub React packages."""

import json

#
# General definitions
#
REFERENCE_FILE = "package-lock.json"

#
# 1. Loading package dependencies
#
package_json = json.load(open(REFERENCE_FILE))

#
# 2. Getting dependencies
#
dependencies = package_json["dependencies"]

#
# 3. Removing dependencies from GEO Knowledge Hub packages installed from GitHub
#
for depkey in dependencies.keys():
    if "@geo-knowledge-hub" in depkey:
        del dependencies[depkey]["integrity"]

#
# 4. Saving the modified result
#
json.dump(package_json, open(REFERENCE_FILE, "w"))
