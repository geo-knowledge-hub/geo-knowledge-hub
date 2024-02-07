/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { getInputFromDOM } from "react-invenio-deposit";

import { EngagementImages } from "@geo-knowledge-hub/geo-components-react";

//
// Constants
//
const engagementSearchQuery = "/search?q=metadata.engagement_priorities.id";

//
// Render the Engagement Priorities component.
//
export const renderComponent = (...args) => {
  // Extracting the engagement values
  const componentDiv = document.getElementById("recordEngagements");
  const recordEngagements = getInputFromDOM("recordEngagementsData");

  let recordEngagementsData = recordEngagements;

  // Removing data to avoid errors in the interface
  if (recordEngagements) {
    recordEngagementsData = recordEngagements.filter(
      (x) => !(["", null].indexOf(x.props.icon) > -1),
    );
  }

  if (recordEngagementsData.length > 0) {
    // Rendering!
    ReactDOM.render(
      <div className={"details-engagement-images"}>
        <EngagementImages
          engagements={recordEngagementsData}
          filterUrl={engagementSearchQuery}
        />
      </div>,
      componentDiv,
    );
  } else {
    document.getElementById("engagement-priorities-sidebar").remove();
  }
};
