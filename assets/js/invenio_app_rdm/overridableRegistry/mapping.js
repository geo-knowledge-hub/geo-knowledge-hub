/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { FeedPostCreationLabel, TrainingRequestLabel } from "./components";

/**
 * Overriding Components
 */
export const overriddenComponents = {
  "RequestTypeLabel.layout.requests-assistance-feed-creation": FeedPostCreationLabel,
  "RequestTypeLabel.layout.requests-assistance-training-creation": TrainingRequestLabel
};
