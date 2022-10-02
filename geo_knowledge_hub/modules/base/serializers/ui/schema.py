# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""UI Serializer schema."""

from invenio_rdm_records.resources.serializers.ui.schema import (
    UIRecordSchema as UIRecordSchemaBase,
)
from invenio_vocabularies.resources import VocabularyL10Schema
from marshmallow import fields


class UIRecordSchema(UIRecordSchemaBase):
    """Schema for dumping extra information for the UI."""

    geo_work_programme_activity = fields.Nested(
        VocabularyL10Schema, attribute="metadata.geo_work_programme_activity"
    )

    target_audiences = fields.List(
        fields.Nested(VocabularyL10Schema),
        attribute="metadata.target_audiences",
    )

    engagement_priorities = fields.List(
        fields.Nested(VocabularyL10Schema),
        attribute="metadata.engagement_priorities",
    )
