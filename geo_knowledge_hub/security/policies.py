# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Base Security Policies."""

from invenio_records_permissions.generators import SystemProcess
from invenio_rdm_records.services.generators import RecordOwners
from invenio_rdm_records.services.permissions import RDMRecordPermissionPolicy

from .generators import GeoKnowledgeProvider, GeoSecretariat


class GeoRecordPermissionPolicy(RDMRecordPermissionPolicy):
    """Access control configuration for records."""

    #
    # Records
    #
    can_manage = [
        RecordOwners(), GeoSecretariat(), SystemProcess()
    ]

    can_create = [
        GeoKnowledgeProvider(), GeoSecretariat(), SystemProcess()
    ]


__all__ = (
    "GeoRecordPermissionPolicy"
)
