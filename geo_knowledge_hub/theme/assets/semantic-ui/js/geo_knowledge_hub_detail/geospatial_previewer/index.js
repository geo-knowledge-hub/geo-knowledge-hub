/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";

import { GeographicMetadataLocationViewer } from "@geo-knowledge-hub/invenio-geographic-components-react";

/**
 * Render the geospatial metadata previewer component.
 */
export const renderComponent = (...args) => {
  const componentDiv = document.getElementById("mapContainer");
  const recordVersionAppDiv = document.getElementById("recordVersionsData");

  if (recordVersionAppDiv) {
    // parsing the record document
    const recordDocument = JSON.parse(recordVersionAppDiv.dataset.record);

    // looking for valid locations data
    const featureData = _get(recordDocument, "metadata.locations.features", []);

    if (!_isEmpty(featureData)) {
      ReactDOM.render(
        <>
          <GeographicMetadataLocationViewer
            featuresData={featureData}
            mapConfig={{
              useGeocoding: false,
              useMouseCoordinate: false,
            }}
          />
        </>,
        componentDiv
      );
    }
  }
};
