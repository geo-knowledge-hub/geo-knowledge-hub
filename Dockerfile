#
# This file is part of GEO Knowledge Hub.
# Copyright 2020-2021 GEO Secretariat.
#
# GEO Knowledge Hub is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
#

FROM registry.cern.ch/inveniosoftware/almalinux:1

#
# Environment variables
#
ENV NODE_OPTIONS="--max-old-space-size=8192"

#
# Base update
#
RUN dnf update -y \
    && dnf clean all

#
# Base Dependencies
#
COPY site ./site
COPY Pipfile Pipfile.lock ./

#
# Installing the InvenioRDM + GEO Knowledge Hub customization
#
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
