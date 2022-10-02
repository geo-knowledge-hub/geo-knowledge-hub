/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { RecordManagement } from "./RecordManagement";

const recordManagementAppDiv = document.getElementById("recordManagement");
const recordManagementMobile = document.getElementById(
  "recordManagementMobile"
);

function renderRecordManagement(element) {
  ReactDOM.render(
    <RecordManagement
      record={JSON.parse(recordManagementAppDiv.dataset.record)}
      permissions={JSON.parse(recordManagementAppDiv.dataset.permissions)}
      isDraft={JSON.parse(recordManagementAppDiv.dataset.isDraft)}
      isPreviewSubmissionRequest={JSON.parse(
        recordManagementAppDiv.dataset.isPreviewSubmissionRequest
      )}
    />,
    element
  );
}

/**
 * Render the geospatial metadata previewer component.
 */
export const renderComponent = (...args) => {
  if (recordManagementAppDiv) {
    renderRecordManagement(recordManagementAppDiv);
    recordManagementMobile && renderRecordManagement(recordManagementMobile);
  }
};
