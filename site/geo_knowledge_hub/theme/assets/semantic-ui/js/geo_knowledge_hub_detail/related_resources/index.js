/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import _last from "lodash/last";
import { ThemeProvider } from "@emotion/react";

import { RelatedResourceTable } from "@geo-knowledge-hub/geo-components-react";

/**
 * Render the Engagement Priorities component.
 */
export const renderComponent = (...args) => {
  // Extracting package info (Assuming the url is the package id)
  const currentPackageId = _last(window.location.pathname.split("/"));

  // Extracting record values
  const componentDiv = document.getElementById("relatedRecordsDiv");
  let relatedRecordsData = [];
  let resourceTypeDefinitions = [];

  if (componentDiv) {
    relatedRecordsData = JSON.parse(componentDiv.dataset.record) || [];
    resourceTypeDefinitions = JSON.parse(componentDiv.dataset.resourceTypes) || [];
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
          packageId={currentPackageId}
          records={relatedRecordsData}
          resourceTypeDefinitions={resourceTypeDefinitions}
          transitionProps={{
            type: "fade down",
            duration: {
              show: 580,
              hide: 580,
            },
          }}
          paginationSizes={[5, 10, 15, 50, 100]}
        />
      </ThemeProvider>,
      componentDiv,
    );
  }
};
