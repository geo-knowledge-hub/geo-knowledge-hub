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

import { PricingPlansTable } from "@geo-knowledge-hub/geo-components-react";

/**
 * Render the geospatial metadata previewer component.
 */
export const renderComponent = (...args) => {
  const componentDiv = document.getElementById("details-pricing-plans-div");

  if (componentDiv) {
    // parsing the record document
    const recordDocument = JSON.parse(componentDiv.dataset.record);

    // looking for valid pricing data
    const pricingData = _get(recordDocument, "metadata.marketplace.pricing", []);

    if (!_isEmpty(pricingData)) {
      ReactDOM.render(
        <>
          <PricingPlansTable
            tableData={pricingData}
            tableConfig={{
              pageSizes: [3, 5, 10],
            }}
          />
        </>,
        componentDiv,
      );
    }
  }
};
