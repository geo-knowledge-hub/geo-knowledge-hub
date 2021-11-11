# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Record services and functions"""

from invenio_rdm_records.services import RDMRecordService
from invenio_records_resources.services.files.service import FileService

from .config import GeoDraftFilesServiceConfig
from .config import GeoRecordFilesServiceConfig
from .config import GeoRecordServiceConfig


class GeoRecordService(RDMRecordService):
    config_name = "GEO_RECORDS_SERVICE_CONFIG"
    default_config = GeoRecordServiceConfig


#
# Record files
#
class GeoRecordFilesService(FileService):
    config_name = "GEO_RECORDS_FILES_SERVICE_CONFIG"
    default_config = GeoRecordFilesServiceConfig


#
# Draft files
#
class GeoDraftFilesService(FileService):
    config_name = "GEO_DRAFT_FILES_SERVICE_CONFIG"
    default_config = GeoDraftFilesServiceConfig
