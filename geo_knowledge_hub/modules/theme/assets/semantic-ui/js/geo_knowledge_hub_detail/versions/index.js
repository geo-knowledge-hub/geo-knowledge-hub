/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { RecordVersionsList } from "./RecordVersionsList";

/**
 * Render the version component.
 */
export const renderComponent = (...args) => {
  const recordVersionsAppDiv = document.getElementById("recordVersionsData");

  if (recordVersionsAppDiv) {
    ReactDOM.render(
      <RecordVersionsList
        record={JSON.parse(recordVersionsAppDiv.dataset.record)}
        isPreview={JSON.parse(recordVersionsAppDiv.dataset.preview)}
      />,
      recordVersionsAppDiv
    );
  }
};
