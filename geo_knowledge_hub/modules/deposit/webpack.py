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
                "geo-knowledge-hub-deposit": "./js/geo-knowledge-hub/deposit-form/index.js",
                "geo-knowledge-hub-user-records-search": "./js/geo-knowledge-hub/user-records-search/index.js"
            },
            dependencies={
                "@babel/runtime": "^7.9.0",
                'formik': '^2.1.4',
                'luxon': '^1.23.0',
                'path': '^0.12.7',
                'prop-types': '^15.7.2',
                'react-dnd': '^11.1.3',
                'react-dnd-html5-backend': '^11.1.3',
                'react-invenio-deposit': '^0.16.1',
                'react-invenio-forms': '^0.8.7',
                'react-dropzone': "^11.0.3",
                'yup': '^0.32.9',
                '@ckeditor/ckeditor5-build-classic': '^16.0.0',
                '@ckeditor/ckeditor5-react': '^2.1.0',
                "i18next": "^20.3.1",
                "react-i18next": "^11.11.3",
                "i18next-browser-languagedetector": "^6.1.1",
                'react-copy-to-clipboard': '^5.0.3',
                '@brainhubeu/react-carousel': '^2.0.4',
                'react-searchkit': '^1.0.0-alpha.17',
                'react-overridable': '^0.0.3',
                'sweetalert2': '^11.1.7',
                'sweetalert2-react-content': '^4.1.1'
            },
            aliases={
                "@invenio-app-rdm": "js/invenio_app_rdm"
            }
        )
    }
)
