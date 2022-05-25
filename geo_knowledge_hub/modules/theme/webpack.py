# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) webpack."""

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    import_name=__name__,
    folder="assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            entry={
                # Detail page (aka Record Landing Page)
                "geo-knowledge-hub-detail": "./js/geo_knowledge_hub_detail/index.js",
                "geo-knowledge-hub-detail-theme": "./less/geo_knowledge_hub_detail/theme.less",
                # Front page
                "geo-knowledge-hub-front": "./js/geo_knowledge_hub_front/index.js",
                "geo-knowledge-hub-front-theme": "./less/geo_knowledge_hub_front/theme.less",
                # Deposit
                "geo-knowledge-hub-deposit": "./js/geo_knowledge_hub_deposit/deposit_form/index.js",
                # Search
                "geo-knowledge-hub-search": "./js/geo_knowledge_hub_search/index.js",
                # Dashboard
                "geo-knowledge-hub-user-dashboard": "./js/geo_knowledge_hub_dashboard/index.js",
            },
            dependencies={
                "react-semantic-toasts": "^0.6.6",
                "leaflet": "^1.7.1",
                "react-leaflet": "3.1.0",
                "@react-leaflet/core": "1.0.2",
                "natsort": "^2.0.3",
                "lodash": "^4.17.0",
                "pure-react-carousel": "^1.28.1",
                "minisearch": "^4.0.3",
                "react-minisearch": "^5.0.0-beta1",
                "react-table": "^7.7.0",
                "@geo-knowledge-hub/geo-deposit-react": "0.2.1",
                "@geo-knowledge-hub/geo-components-react": "0.3.2",
                "@geo-knowledge-hub/react-invenio-deposit": "0.17.12",
                "@geo-knowledge-hub/geo-metadata-previewer-react": "0.1.1-alpha",
                "@emotion/react": "^11.9.0",
                "@emotion/css": "^11.9.0",
                "@emotion/styled": "^11.8.1",
                "react-lazy-load-image-component": "^1.5.4",
            },
            aliases={
                "@invenio-app-rdm": "js/invenio_app_rdm",
                "@geo-knowledge-hub-search": "js/geo_knowledge_hub_search",
            },
        )
    },
)
