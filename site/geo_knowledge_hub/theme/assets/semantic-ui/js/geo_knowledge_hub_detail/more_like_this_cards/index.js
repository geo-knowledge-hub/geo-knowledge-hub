/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2024 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { RecordsTable } from "@geo-knowledge-hub/geo-components-react";

const detailsMoreLikeThisRecordsDiv = document.getElementById("details-more-like-this-records-div");

/**
 * Render `More like this component` component
 */
export const renderComponent = (...args) => {
  if (detailsMoreLikeThisRecordsDiv) {
    ReactDOM.render(
      <RecordsTable
        tableData={JSON.parse(detailsMoreLikeThisRecordsDiv.dataset.morelikethisrecords)}
      />,
      detailsMoreLikeThisRecordsDiv,
    );
  }
};
