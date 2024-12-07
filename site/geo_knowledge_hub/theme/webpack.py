# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) webpack."""

from flask_webpackext import WebpackBundleProject
from invenio_assets.webpack import WebpackThemeBundle
from pywebpack import bundles_from_entry_point

# In order to install and configure the dependencies, we used to
# create the GEO Knowledge Hub interface we override the frontend
# build project. We are developing and configuring the webpack
# project based on the files created by the Invenio Assets.
# Also, this approach was presented to us by the Tu Wien Team.
# (https://gitlab.tuwien.ac.at/fairdata/invenio-theme-tuw/-/tree/master/invenio_theme_tuw/build_project)
# Thank you!
project = WebpackBundleProject(
    import_name=__name__,
    project_folder="config",
    config_path="build/config.json",
    bundles=bundles_from_entry_point("invenio_assets.webpack"),
)

theme = WebpackThemeBundle(
    import_name=__name__,
    folder="assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            entry={
                # Base
                "geo-knowledge-hub-base": "./js/base.js",
                "geo-knowledge-hub-base-theme": "./less/base.less",
                # Detail page (aka Record Landing Page)
                "geo-knowledge-hub-detail": "./js/geo_knowledge_hub_detail/index.js",
                # Front page
                "geo-knowledge-hub-front": "./js/geo_knowledge_hub_front/index.js",
                # Deposit
                "geo-knowledge-hub-deposit-package": "./js/geo_knowledge_hub_deposit/deposit_form/package/index.js",
                "geo-knowledge-hub-deposit-record": "./js/geo_knowledge_hub_deposit/deposit_form/record/index.js",
                # Search
                "geo-knowledge-hub-search": "./js/geo_knowledge_hub_search/index.js",
                # Dashboard
                "geo-knowledge-hub-user-uploads": "./js/geo_knowledge_hub_dashboard/uploads.js",
                # Community
                "geo-knowledge-hub-details-search": "./js/geo_knowledge_hub_community/details-search.js",
                "geo-knowledge-hub-community-frontpage": "./js/geo_knowledge_hub_community/frontpage.js",
                "geo-knowledge-hub-community-search": "./js/geo_knowledge_hub_community/communities_search/index.js",
                "geo-knowledge-hub-community-carousel": "./js/geo_knowledge_hub_community/communities_carousel/index.js",
                # Marketplace
                "geo-knowledge-hub-marketplace-item-deposit": "./js/geo_knowledge_hub_deposit/marketplace/index.js",
                # Previewer
                "videojs_js": "./node_modules/video.js/dist/video.min.js",
                "videojs_css": "./less/preview.less",
            },
            dependencies={
                "react-semantic-toasts": "^0.6.6",
                "leaflet": "^1.7.1",
                "react-leaflet": "3.1.0",
                "@react-leaflet/core": "1.0.2",
                "natsort": "^2.0.3",
                "lodash": "^4.17.0",
                "minisearch": "^4.0.3",
                "react-minisearch": "^5.0.0-beta1",
                "react-table": "^7.7.0",
                "@geo-knowledge-hub/invenio-geographic-components-react": "github:geo-knowledge-hub/invenio-geographic-components-react#72482a689d2011c27d59fc97c676e5c2e1218a01",
                "@geo-knowledge-hub/geo-components-react": "github:geo-knowledge-hub/geo-components-react#fb89be0bf1c2e2019e67486b8155d18bfc59defe",
                "@geo-knowledge-hub/geo-deposit-react": "github:geo-knowledge-hub/geo-deposit-react#b6ade61f23eb137de7f38de6769db678dc950bc1",
                "@geo-knowledge-hub/geo-comments-react": "github:geo-knowledge-hub/geo-comments-react#44287d698b40840f45e4bd4fb5cbcfe41f3b1657",
                "@emotion/react": "^11.9.0",
                "@emotion/css": "^11.9.0",
                "@emotion/styled": "^11.8.1",
                "react-lazy-load-image-component": "^1.5.4",
                "leaflet.fullscreen": "^1.6.0",
                "leaflet-control-geocoder": "^2.4.0",
                "@turf/convex": "^6.5.0",
                "@turf/flip": "^6.5.0",
                "@turf/bbox-polygon": "^6.5.0",
                "@turf/centroid": "^6.5.0",
                "@mapbox/geojsonhint": "^3.0.1",
                "@geoman-io/leaflet-geoman-free": ">2.14.0 <2.15.0",
                "@tanstack/react-query": "^4.32.6",
                "slick-carousel": "^1.8.1",
                "react-slick": "^0.29.0",
                "video.js": "^8.6.1",
            },
            aliases={
                "@invenio-app-rdm": "js/invenio_app_rdm",
                "@geo-knowledge-hub-search": "js/geo_knowledge_hub_search",
                "@translations/geo_knowledge_hub": "translations/geo_knowledge_hub",
            },
        )
    },
)
