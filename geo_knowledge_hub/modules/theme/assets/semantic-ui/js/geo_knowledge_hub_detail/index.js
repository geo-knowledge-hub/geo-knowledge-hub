/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import $ from "jquery";

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
  "management_menu",
  "related_resources",
  "user_stories",
  "versions",
];

renderFactory(componentsAvailable);

$("#get-in-touch-ask-provider-modal-btn").on("click", function () {
  $("#get-in-touch-ask-provider-modal")
    .modal({
      blurring: true,
      centered: false,
    })
    .modal("show");
});
