# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub extension for InvenioRDM"""

import os

from setuptools import find_packages, setup

readme = open('README.rst').read()
history = open('CHANGES.rst').read()

tests_require = [
    'pytest-invenio>=1.4.0',
]

extras_require = {
    'docs': [
        'Sphinx>=3,<4',
    ],
    'tests': tests_require,
}

extras_require['all'] = [req for _, reqs in extras_require.items() for req in reqs]

setup_requires = [
    'Babel>=2.8',
]

install_requires = [
    'invenio-i18n>=1.2.0',
    'Flask-Discussion>=0.1.1,<0.2',
    'pydash>=5.1.0',
    'IDUtils>=1.1.9'
]

packages = find_packages()

# Get the version string. Cannot be done with import!
g = {}
with open(os.path.join('geo_knowledge_hub', 'version.py'), 'rt') as fp:
    exec(fp.read(), g)
    version = g['__version__']

setup(
    name='geo-knowledge-hub',
    version=version,
    description=__doc__,
    long_description=readme + '\n\n' + history,
    keywords=['Geospatial', 'Digital Library', 'Earth Observations', 'Invenio RDM'],
    license='MIT',
    author='GEO Secretariat',
    author_email='geokhub@geosec.org',
    url='https://github.com/geo-knowledge-hub/geo-knowledge-hub',
    packages=packages,
    zip_safe=False,
    include_package_data=True,
    platforms='any',
    entry_points={
        'invenio_access.actions': [
            'geo-community-access'
            ' = geo_knowledge_hub.security.permissions:geo_community_access_action',
            'geo-provider-access'
            ' = geo_knowledge_hub.security.permissions:geo_provider_access_action',
            'geo-secretariat-access'
            ' = geo_knowledge_hub.security.permissions:geo_secretariat_access_action'
        ],
        'invenio_base.apps': [
            'geo_knowledge_hub = geo_knowledge_hub:GeoKnowledgeHub',
            'geo_knowledge_hub_discussion = flask_discussion:Discussion'
        ],
        'invenio_i18n.translations': [
            'messages = geo_knowledge_hub',
        ],
        "invenio_config.module": [
            "geo_knowledge_hub = geo_knowledge_hub.config",
        ],
        'invenio_assets.webpack': [
            'geo_knowledge_hub_deposit = geo_knowledge_hub.modules.deposit.webpack:theme'
        ]
        # 'invenio_access.actions': [],
        # 'invenio_admin.actions': [],
        # 'invenio_assets.bundles': [],
        # 'invenio_base.api_apps': [],
        # 'invenio_base.api_blueprints': [],
        # 'invenio_base.blueprints': [],
        # 'invenio_celery.tasks': [],
        # 'invenio_db.models': [],
        # 'invenio_pidstore.minters': [],
        # 'invenio_records.jsonresolver': [],
    },
    extras_require=extras_require,
    install_requires=install_requires,
    setup_requires=setup_requires,
    tests_require=tests_require,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Development Status :: 1 - Planning',
    ],
)
