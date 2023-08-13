# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) configuration handler."""

from flask import current_app, g
from invenio_app_rdm.records_ui.views.deposits import (
    VocabulariesOptions as BaseVocabulariesOptions,
)
from invenio_app_rdm.records_ui.views.deposits import (
    get_form_config as base_form_config,
)
from invenio_vocabularies.proxies import current_service as vocabulary_service
from pydash import py_


class VocabulariesOptions(BaseVocabulariesOptions):
    """Form vocabularies options."""

    def _resource_types(self, extra_filter):
        """Dump resource type vocabulary."""
        type_ = "resourcetypes"
        all_resource_types = vocabulary_service.read_all(
            g.identity,
            fields=["id", "props", "title", "icon"],
            type=type_,
            # Sorry, we have over 100+ resource types entry at NU actually
            max_records=150,
        )
        type_labels = {
            hit["id"]: self._get_label(hit)
            for hit in all_resource_types.to_dict()["hits"]["hits"]
        }
        subset_resource_types = vocabulary_service.read_all(
            g.identity,
            fields=["id", "props", "title", "icon"],
            type=type_,
            extra_filter=extra_filter,
            # Sorry, we have over 100+ resource types entry at NU actually
            max_records=150,
        )

        return [
            {
                "icon": hit.get("icon", ""),
                "id": hit["id"],
                "subtype_name": self._get_type_subtype_label(hit, type_labels)[
                    1
                ],  # noqa
                "type_name": self._get_type_subtype_label(hit, type_labels)[0],
                "basetype": py_.get(hit, "props.basetype"),
            }
            for hit in subset_resource_types.to_dict()["hits"]["hits"]
        ]

    def engagement_priorities(self):
        """Dump Engagement Priorities type vocabulary."""
        self._vocabularies["engagement_priorities"] = dict(
            type=self._dump_vocabulary_w_basic_fields("engagementprioritiestypes")
        )

        return self._vocabularies["engagement_priorities"]

    def dump(self):
        """Dump the configuration into dict."""
        self.engagement_priorities()
        return super().dump()


def get_form_config(**kwargs):
    """Generate the form configuration."""
    # generate the base values
    base_configuration = base_form_config(**kwargs)

    return {
        **base_configuration,
        **{"vocabularies": VocabulariesOptions().dump()},
    }


def load_from_config(key):
    """Load configuration from the current application config."""
    return current_app.config.get(key)
