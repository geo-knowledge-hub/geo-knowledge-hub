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
                # Deposit
                "geo-knowledge-hub-deposit": "./js/geo_knowledge_hub_deposit/deposit_form/index.js",
                # User Stories
                "geo-knowledge-hub-landing-user-stories": "./js/geo_knowledge_hub_detail/user_stories/index.js",
                # Engagement carousel
                "geo-knowledge-hub-landing-engagements-carousel": "./js/geo_knowledge_hub_detail/engagements_carousel_sidebar/index.js",
                "geo-knowledge-hub-landing-engagements-carousel-theme": "./less/geo_knowledge_hub_detail/engagements_carousel_sidebar/theme.less",
                # Geospatial metadata visualizer
                "geo-knowledge-hub-landing-geospatial-metadata-visualizer": "./js/geo_knowledge_hub_detail/geospatial_previewer/index.js",
                "geo-knowledge-hub-landing-geospatial-metadata-visualizer-theme": "./less/geo_knowledge_hub_detail/geospatial_previewer/theme.less",
                # Frontpage carousel
                "geo-knowledge-hub-front-carousel": "./js/geo_knowledge_hub_front/front/index.js",
                "geo-knowledge-hub-front-carousel-theme": "./less/geo_knowledge_hub_front/front/theme.less",
                "geo-knowledge-hub-front-overview-theme": "./less/geo_knowledge_hub_front/overview/theme.less",
            },
            dependencies={
                "sweetalert2": "^11.1.7",
                "sweetalert2-react-content": "^4.1.1",
                "leaflet": "^1.7.1",
                "react-leaflet": "3.1.0",
                "@react-leaflet/core": "1.0.2",
                "natsort": "^2.0.3",
                "lodash": "^4.17.0",
                "react-glider": "^3.0.1",
                "pure-react-carousel": "^1.28.1",
                "minisearch": "^4.0.3",
                "react-minisearch": "^5.0.0-beta1",
                "react-table": "^7.7.0",
                "styled-components": "^5.3.5",
                "react-share": "^4.4.0",
                "@geo-knowledge-hub/geo-deposit-react": "0.2.1",
                "@geo-knowledge-hub/geo-components-react": "0.2.1",
                "@geo-knowledge-hub/react-invenio-deposit": "b-1.1",
                "@geo-knowledge-hub/geo-metadata-previewer-react": "0.1.1-alpha"
            },
            aliases={"@invenio-app-rdm": "js/invenio_app_rdm"},
        )
    },
)
