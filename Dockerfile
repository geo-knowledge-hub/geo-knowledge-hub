#
# This file is part of GEO Knowledge Hub.
# Copyright 2020-2021 GEO Secretariat.
#
# GEO Knowledge Hub is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
#

#
# This image installs all Python dependencies for the InvenioRDM application. It's based
# on CentOS 7 with Python 3 (https://github.com/inveniosoftware/docker-invenio)
# and includes Pip, Pipenv, Node.js, NPM and some few standard libraries
# Invenio usually needs.
#

FROM inveniosoftware/centos8-python:3.8

#
# Base Dependencies
#
COPY geo_knowledge_hub geo_knowledge_hub
COPY Pipfile Pipfile.lock \
     setup.py setup.cfg \
     README.rst CHANGES.rst \
     MANIFEST.in ./

RUN pipenv install --deploy --system --pre

#
# Auxiliary files
#
COPY ./docker/uwsgi/ ${INVENIO_INSTANCE_PATH}
COPY ./invenio.cfg ${INVENIO_INSTANCE_PATH}
COPY ./templates/ ${INVENIO_INSTANCE_PATH}/templates/
COPY ./app_data/ ${INVENIO_INSTANCE_PATH}/app_data/
COPY ./ .

#
# Building the InvenioRDM based application
#
RUN cp -r ./static/. ${INVENIO_INSTANCE_PATH}/static/ && \
    cp -r ./assets/. ${INVENIO_INSTANCE_PATH}/assets/ && \
    invenio collect --verbose  && \
    invenio webpack create && \
    invenio webpack install --unsafe && \
    invenio webpack build && \
    pip install ipython_genutils

ENTRYPOINT [ "bash", "-c" ]
