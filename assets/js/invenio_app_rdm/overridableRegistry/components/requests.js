/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { Label } from "semantic-ui-react";
import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Feed post request label for the requests page.
 */
export const FeedPostCreationLabel = () => (
  <Label className="primary" size="small">{i18next.t("New feed post")}</Label>
)

/**
 * Training request label for the requests page.
 */
export const TrainingRequestLabel = () => (
  <Label className="primary" size="small">{i18next.t("Training request")}</Label>
)
