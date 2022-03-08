# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.


from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "theme/assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            entry={"geo-knowledge-hub-rdm": "./less/geo_knowledge_hub_rdm/theme.less"},
            dependencies={},
        )
    },
)
