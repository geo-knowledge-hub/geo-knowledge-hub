# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Deposit (page) configuration handler."""

from invenio_app_rdm.records_ui.views.deposits import (
    VocabulariesOptions as BaseVocabulariesOptions,
)
from invenio_app_rdm.records_ui.views.deposits import (
    get_form_config as base_form_config,
)


class VocabulariesOptions(BaseVocabulariesOptions):
    """Form vocabularies options."""

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
