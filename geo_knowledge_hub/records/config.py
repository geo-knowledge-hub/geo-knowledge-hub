# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Record Service Config"""

from invenio_rdm_records.services import RDMRecordServiceConfig, RDMFileRecordServiceConfig, RDMFileDraftServiceConfig

from ..security.policies import GeoRecordPermissionPolicy


class GeoRecordServiceConfig(RDMRecordServiceConfig):
    permission_policy_cls = GeoRecordPermissionPolicy


#
# Record files
#
class GeoRecordFilesServiceConfig(RDMFileRecordServiceConfig):
    permission_policy_cls = GeoRecordPermissionPolicy


#
# Draft files
#
class GeoDraftFilesServiceConfig(RDMFileDraftServiceConfig):
    permission_policy_cls = GeoRecordPermissionPolicy
