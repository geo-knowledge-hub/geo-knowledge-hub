# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 GEO Secretariat.
#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Forms"""

from flask_wtf import FlaskForm
from wtforms import SelectField
from wtforms import StringField
from wtforms import SubmitField
from wtforms import TextAreaField
from wtforms.validators import DataRequired
from wtforms.validators import Email
from wtforms.validators import Length

FORM_REQUEST_ACCESS_BECOME_A_PROVIDER_OPTIONS = [
    ("Knowledge Provider", "Knowledge Provider"),
    ("Geo Community", "Geo Community")
]


class RequestAccessForm(FlaskForm):
    name = StringField(
        "Name",
        [
            DataRequired()
        ]
    )

    email = StringField(
        "Email",
        [
            Email(message="Invalid email!"),
            DataRequired()
        ]
    )

    text = TextAreaField(
        "Why would i want to be a knowledge provider ?",
        [
            Length(min=4, message="Your message is too short"),
            DataRequired()
        ]
    )

    become_a_provider = SelectField(
        u"Do you want become a Knowledge Provider ?",
        choices=FORM_REQUEST_ACCESS_BECOME_A_PROVIDER_OPTIONS
    )

    submit = SubmitField("Submit")
