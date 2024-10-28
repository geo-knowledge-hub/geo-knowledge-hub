# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Detail (page) toolbox."""

from geo_rdm_records.base.records.types import GEORecordTypes
from geo_rdm_records.proxies import (
    current_geo_packages_service,
    current_marketplace_service,
)
from invenio_communities.proxies import current_communities
from invenio_rdm_records.proxies import current_rdm_records_service


#
# Templates
#
class TemplateRegistry:
    """Template registry."""

    types = {
        GEORecordTypes.package: "geo_knowledge_hub/details/detail.html",
        GEORecordTypes.resource: "geo_knowledge_hub/details/detail.html",
        GEORecordTypes.marketplace_item: "geo_knowledge_hub/marketplace/details/index.html",
    }
    """Record types."""

    default_template = "geo_knowledge_hub/details/detail.html"
    """Default template."""

    @classmethod
    def get_template(cls, record_type, use_default=False):
        """Get service by record type."""
        record_template = cls.types.get(record_type)

        if not record_template and use_default:
            record_template = cls.default_template

        return record_template


#
# Services
#
class ServiceRegistry:
    """Record service registry."""

    services = {
        "record": current_rdm_records_service,
        "package": current_geo_packages_service,
        "community": current_communities,
        "marketplace-item": current_marketplace_service,
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
    return base_service.files if hasattr(base_service, "files") else None


def get_draft_files_service(record_type):
    """(Draft) Files record service factory."""
    base_service = ServiceRegistry.get_service(record_type)
    return base_service.draft_files if hasattr(base_service, "draft_files") else None
