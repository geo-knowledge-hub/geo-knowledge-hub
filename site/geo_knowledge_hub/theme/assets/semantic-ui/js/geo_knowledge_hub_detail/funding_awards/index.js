/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2024 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { FundingAwardsTable } from "@geo-knowledge-hub/geo-components-react";

const detailsFundingAwardsDiv = document.getElementById(
  "details-funding-awards-div",
);

/**
 * Render `More like this component` component
 */
export const renderComponent = (...args) => {
  if (detailsFundingAwardsDiv) {
    ReactDOM.render(
      <FundingAwardsTable
        tableData={JSON.parse(
          detailsFundingAwardsDiv.dataset.fundingAwards,
        )}
        extraConfig={JSON.parse(
          detailsFundingAwardsDiv.dataset.configAwards
        )}
      />,
      detailsFundingAwardsDiv,
    );
  }
};
