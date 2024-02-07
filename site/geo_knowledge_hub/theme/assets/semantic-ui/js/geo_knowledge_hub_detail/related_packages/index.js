/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { RelatedPackagesTable } from "@geo-knowledge-hub/geo-components-react";

const detailsRelatedPackagesDiv = document.getElementById(
  "details-related-packages-div",
);

/**
 * Render the Engagement Priorities component.
 */
export const renderComponent = (...args) => {
  ReactDOM.render(
    <RelatedPackagesTable
      tableData={JSON.parse(detailsRelatedPackagesDiv.dataset.relatedpackages)}
    />,
    detailsRelatedPackagesDiv,
  );
};
