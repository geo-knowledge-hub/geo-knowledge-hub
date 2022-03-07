# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from pydash import py_

from flask import render_template, url_for

from invenio_app_rdm.records_ui.views.decorators import (
    pass_record_files,
    pass_record_or_draft,
)

from invenio_rdm_records.resources.serializers import UIJSONSerializer

from .toolbox.search import get_related_resources_metadata
from .toolbox.identifiers import related_identifiers_url_by_scheme
from .toolbox.vocabulary import get_engagement_priority_from_record


@pass_record_or_draft
@pass_record_files
def geo_record_detail(record=None, files=None, pid_value=None, is_preview=False):
    """Record detail page (aka landing page)."""
    files_dict = None if files is None else files.to_dict()
    related_records_informations = get_related_resources_metadata(
        record.to_dict()["metadata"]
    )

    related_identifiers = py_.get(record.data, "metadata.related_identifiers", [])
    related_identifiers = related_identifiers_url_by_scheme(related_identifiers)

    # engagement priorities
    related_engagement_priorities = get_engagement_priority_from_record(
        record, ["TU", "EP"]
    ).to_dict()

    py_.set(
        related_engagement_priorities,
        "hits.hits",
        py_.map(
            py_.get(related_engagement_priorities, "hits.hits", []),
            lambda x: py_.set_(
                x, "props.icon", url_for("static", filename=x["props"]["icon"])
            ),
        ),
    )

    # removing all related resource that is a knowledge resource
    related_identifiers = py_.filter(
        related_identifiers,
        lambda x: x["identifier"].split("/")[-1]
        not in py_.map(related_records_informations, lambda y: y["id"]),
    )

    return render_template(
        "geo_knowledge_hub/records/detail.html",
        pid=pid_value,
        files=files_dict,
        is_preview=is_preview,
        related_identifiers=related_identifiers,
        related_records_informations=related_records_informations,
        related_engagement_priorities=related_engagement_priorities,
        record=UIJSONSerializer().serialize_object_to_dict(record.to_dict()),
        permissions=record.has_permissions_to(
            ["edit", "new_version", "manage", "update_draft", "read_files"]
        ),
    )
