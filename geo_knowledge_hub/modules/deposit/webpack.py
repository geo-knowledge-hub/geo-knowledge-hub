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
            entry={
                "geo-knowledge-hub-deposit": "./js/geo_knowledge_hub/deposit_form/index.js",
                "geo-knowledge-hub-user-records-search": "./js/geo_knowledge_hub/user_records_search/index.js"
            },
            dependencies={
                "sweetalert2": "^11.1.7",
                "sweetalert2-react-content": "^4.1.1"
            },
            aliases={
                "@invenio-app-rdm": "js/invenio_app_rdm"
            }
        )
    }
)
