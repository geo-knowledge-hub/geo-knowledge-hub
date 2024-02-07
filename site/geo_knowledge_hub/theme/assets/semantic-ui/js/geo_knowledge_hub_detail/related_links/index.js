/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { ExternalResourceTable } from "@geo-knowledge-hub/geo-components-react";

const detailsListDiv = document.getElementById("details-list-div");

/**
 * Render the Engagement Priorities component.
 */
export const renderComponent = (...args) => {
  ReactDOM.render(
    <ExternalResourceTable
      tableData={JSON.parse(detailsListDiv.dataset.relatedidentifiers)}
    />,
    detailsListDiv,
  );
};
