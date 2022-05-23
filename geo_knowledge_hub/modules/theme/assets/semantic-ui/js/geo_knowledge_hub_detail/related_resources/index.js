/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { ThemeProvider } from "@emotion/react";

import { resourceTypeDefinitions } from "./cache";
import { RelatedResourceTable } from "@geo-knowledge-hub/geo-components-react";

/**
 * Render the Engagement Priorities component.
 */
export const renderComponent = (...args) => {
  // Extracting the engagement values
  const componentDiv = document.getElementById("relatedRecordsDiv");
  let relatedRecordsData = [];

  if (componentDiv) {
    relatedRecordsData = JSON.parse(componentDiv.dataset.record) || [];
  }

  if (relatedRecordsData.length > 0) {
    // Preparing the theme
    const theme = {
      slides: {},
    };

    // Rendering!
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <RelatedResourceTable
          records={relatedRecordsData}
          resourceTypeDefinitions={resourceTypeDefinitions}
          transitionProps={{
            type: "fade down",
            duration: {
              show: 580,
              hide: 580,
            },
          }}
        />
      </ThemeProvider>,
      componentDiv
    );
  }
};
