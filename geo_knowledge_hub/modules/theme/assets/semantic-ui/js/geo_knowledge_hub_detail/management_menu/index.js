/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { RecordManagement } from "./components";

/**
 * Render the Management Stories component.
 */
export const renderComponent = (...args) => {
  const recordManagementAppDiv = document.getElementById(
    "recordManagementVersionsData"
  );

  if (recordManagementAppDiv) {
    ReactDOM.render(
      <RecordManagement
        record={JSON.parse(recordManagementAppDiv.dataset.record)}
        permissions={JSON.parse(recordManagementAppDiv.dataset.permissions)}
      />,
      recordManagementAppDiv
    );
  }
};
