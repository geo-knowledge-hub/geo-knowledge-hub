# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2023 GEO Secretariat.
#
# geo-knowledge-hub is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from flask_babelex import lazy_gettext as _
from invenio_oauth2server.models import Scope

#
# Allow generation of granular access JWT tokens.
#
tokens_generate_scope = Scope(
    id_="generate",
    group="tokens",
    help_text=_("Allow generation of granular access JWT tokens."),
    internal=True,
)
