/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { GeospatialMetadataVisualizer } from "@geo-knowledge-hub/geo-metadata-previewer-react";

// Extracting the record information
// note: we use the same approach as presented
// in the `invenio-app-rdm`:
const recordVersionAppDiv = document.getElementById("recordVersions");

// Checking for a valid record document
if (recordVersionAppDiv) {
  // parsing the record document
  const recordDocument = JSON.parse(recordVersionAppDiv.dataset.record);

  ReactDOM.render(
    <GeospatialMetadataVisualizer
      mapContainerOptions={{
        id: "map-container",
        scrollWheelZoom: true,
      }}
      recordContext={recordDocument}
    />,
    document.getElementById("map-container")
  );
}
