/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { ExternalFilesTable } from "@geo-knowledge-hub/geo-components-react";

const detailsListDiv = document.getElementById(
  "details-list-div-external-files",
);

/**
 * Render the external files table component.
 */
export const renderComponent = (...args) => {
  if (detailsListDiv) {
    const externalFiles = JSON.parse(detailsListDiv.dataset.externalFiles);

    ReactDOM.render(
      <ExternalFilesTable
        tableData={externalFiles}
        tableConfig={{
          pageSizes: [3, 5, 10, 20, 50],
        }}
      />,
      detailsListDiv,
    );
  }
};
