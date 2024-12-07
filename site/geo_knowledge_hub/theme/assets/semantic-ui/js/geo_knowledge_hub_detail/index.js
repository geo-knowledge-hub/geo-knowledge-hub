/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";

// Factorizing
const renderFactory = async (componentsAvailable) => {
  await componentsAvailable.forEach(async (componentName) => {
    const componentModule = await import(`./${componentName}`);
    componentModule.renderComponent();
  });
};

// Importing the components
const componentsAvailable = [
  "engagements_carousel_sidebar",
  "geospatial_previewer",
  "related_resources",
  "user_stories",
  "versions",
  "record_management",
  "related_links",
  "related_packages",
  "request_training",
  "more_like_this_cards",
  "external_files",
  "funding_awards"
];

renderFactory(componentsAvailable);
