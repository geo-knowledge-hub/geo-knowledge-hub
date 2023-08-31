/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2023 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { RequestTraining } from "./components";

// Render div
const requestTrainingAppDiv = document.getElementById("requestTraining");

// Data div
const recordVersionAppDiv = document.getElementById("recordVersionsData");

function renderTrainingSection(element) {
  ReactDOM.render(
    <RequestTraining
      record={JSON.parse(recordVersionAppDiv.dataset.record)}
      userIsAuthenticated={JSON.parse(
        requestTrainingAppDiv.dataset.userIsAuthenticated,
      )}
      existingAssistanceRequests={JSON.parse(
        requestTrainingAppDiv.dataset.assistanceRequests,
      )}
    />,
    element,
  );
}

/**
 * Render the components
 */
export const renderComponent = (...args) => {
  if (requestTrainingAppDiv) {
    renderTrainingSection(requestTrainingAppDiv);
  }
};
