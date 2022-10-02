# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Detail (page) toolbox."""

from geo_rdm_records.proxies import current_geo_packages_service
from invenio_rdm_records.proxies import current_rdm_records_service


#
# Services
#
class ServiceRegistry:
    """Record service registry."""

    services = {
        "record": current_rdm_records_service,
        "package": current_geo_packages_service,
    }

    @classmethod
    def get_service(cls, record_type):
        """Get service by record type."""
        return cls.services[record_type]


def get_record_service(record_type):
    """Record service factory."""
    return ServiceRegistry.get_service(record_type)


def get_files_service(record_type):
    """Files record service factory."""
    base_service = ServiceRegistry.get_service(record_type)
    return base_service.files


def get_draft_files_service(record_type):
    """(Draft) Files record service factory."""
    base_service = ServiceRegistry.get_service(record_type)
    return base_service.draft_files
