#!/bin/bash
#
# This file is part of GEO Knowledge Hub.
# Copyright 2020-2021 GEO Secretariat.
#
# GEO Knowledge Hub is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
#

#
# General definitions
#
BASE_DIRECTORY=$PWD

VERDACCIO_USERNAME=foo
VERDACCIO_PASSWORD=test
VERDACCIO_EMAIL=test@test.org

VERDACCIO_LOCAL_REGISTRY=http://127.0.0.1:4873
VERDACCIO_DOCKER_REGISTRY=http://127.0.0.1:4873

GEO_KNOWLEDGE_HUB_ORGANIZATION_URL=https://github.com/geo-knowledge-hub

#
# Auxiliary functions
#

# Name: extract_from_quotes
# Description: Extract values between quotes in a string
extract_from_quotes() {
	echo "$1" | cut -d'"' -f 2
}

#
# 1. Configuring the required services to build
#
docker-compose -f docker/builder/docker-compose.yml up -d

#
# 2. Authenticating on registry
#

# installing utilitary tool to auth
npm install -g npm-cli-login

# authenticating
npm-cli-login \
    -u $VERDACCIO_USERNAME \
    -p $VERDACCIO_PASSWORD \
    -e $VERDACCIO_EMAIL \
    -r $VERDACCIO_LOCAL_REGISTRY

#
# 3. Publishing JavaScript dependencies from `geo-knowledge-hub` to verdaccio
#

# build required dependencies
npm install -g rimraf json rollup

# registering the local registry
echo "@geo-knowledge-hub:registry=${VERDACCIO_DOCKER_REGISTRY}" > ~/.npmrc

# extract the dependencies from the `geo-knowledge-hub`
# note: `@geo` is the scope defined to the `geo-knowledge-hub` packages
JAVASCRIPT_DEPENDENCIES_VERSION=`cat geo_knowledge_hub/theme/webpack.py | grep -e @geo-knowledge-hub`
JAVASCRIPT_DEPENDENCIES_ARRAY=(${JAVASCRIPT_DEPENDENCIES_VERSION//,/ })

INTEGRITY_REGULARIZER=${PWD}/docker/builder/services/integrity-regularizer/app.py

# publishing the packages!
for ((i=0;i< ${#JAVASCRIPT_DEPENDENCIES_ARRAY[@]} ; i+=2));
do
    PACKAGE_NAME=`extract_from_quotes ${JAVASCRIPT_DEPENDENCIES_ARRAY[i]}`
    PACKAGE_NAME=${PACKAGE_NAME//@geo-knowledge-hub\/''}

    PACKAGE_VERSION=`extract_from_quotes ${JAVASCRIPT_DEPENDENCIES_ARRAY[i + 1]}`

    # checking if is a branch or tag
    if [[ "$PACKAGE_VERSION" != b* ]]; then
        PACKAGE_VERSION=v$PACKAGE_VERSION
    fi

    git clone --branch $PACKAGE_VERSION $GEO_KNOWLEDGE_HUB_ORGANIZATION_URL/$PACKAGE_NAME $PACKAGE_NAME
    cd $PACKAGE_NAME

    # Regularizing integrity from GitHub dependencies.
    # Used to solve the checksum difference error when multiple environments are used.
    # (Example where the issue is discussed: https://github.com/npm/cli/issues/2846)
    python3 ${INTEGRITY_REGULARIZER}

    npm install
    npm run build
    npm publish --registry $VERDACCIO_LOCAL_REGISTRY
done


#
# 4. Preparing package to build
#
cd $BASE_DIRECTORY

# adding the registry reference in the Dockerfile
sed -i "/^COPY .\/* /a \
RUN npm install -g npm-cli-login && npm-cli-login \\\
    -u $VERDACCIO_USERNAME \\\
    -p $VERDACCIO_PASSWORD \\\
    -e $VERDACCIO_EMAIL \\\
    -r $VERDACCIO_LOCAL_REGISTRY" \
    Dockerfile

sed -i "/^COPY .\/* /a RUN echo \'@geo-knowledge-hub:registry=${VERDACCIO_DOCKER_REGISTRY}\' > ~/.npmrc" Dockerfile

# excluding temporary files
FIRST_PACKAGE=`extract_from_quotes ${JAVASCRIPT_DEPENDENCIES_ARRAY[0]}`
FIRST_PACKAGE=${FIRST_PACKAGE//@geo-knowledge-hub\/''}

rm -rf ${FIRST_PACKAGE//@geo-knowledge-hub\/''}
