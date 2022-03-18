# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    import_name=__name__,
    folder="theme/assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            entry={
                # Engagement carousel
                "geo-knowledge-hub-landing-engagements-carousel": "./js/geo_knowledge_hub_detail/engagements_carousel_sidebar/index.js",
                "geo-knowledge-hub-landing-engagements-carousel-theme": "./less/geo_knowledge_hub_detail/engagements_carousel_sidebar/theme.less",
                # Geospatial metadata visualizer
                "geo-knowledge-hub-landing-geospatial-metadata-visualizer": "./js/geo_knowledge_hub_detail/geospatial_previewer/index.js",
                "geo-knowledge-hub-landing-geospatial-metadata-visualizer-theme": "./less/geo_knowledge_hub_detail/geospatial_previewer/theme.less",
            },
            dependencies={
                "natsort": "^2.0.3",
                "lodash": "^4.17.0",
                "react-glider": "^3.0.1",
                "leaflet": "^1.7.1",
                "react-leaflet": "3.1.0",
                "@react-leaflet/core": "1.0.2",
            },
        )
    },
)