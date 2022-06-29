/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { GeospatialMetadataVisualizer } from "@geo-knowledge-hub/geo-metadata-previewer-react";

/**
 * Render the geospatial metadata previewer component.
 */
export const renderComponent = (...args) => {
  const componentDiv = document.getElementById("mapContainer");
  const recordVersionAppDiv = document.getElementById("recordVersionsData");

  // parsing the record document
  let recordDocument = {};

  if (recordVersionAppDiv) {
    recordDocument = JSON.parse(recordVersionAppDiv.dataset.record);
  }

  // Checking for a valid record document
  if (Object.keys(recordDocument).length > 0) {
    ReactDOM.render(
      <GeospatialMetadataVisualizer
        mapContainerOptions={{
          id: "mapContainer",
          scrollWheelZoom: true,
        }}
        recordContext={recordDocument}
      />,
      componentDiv
    );
  }
};
