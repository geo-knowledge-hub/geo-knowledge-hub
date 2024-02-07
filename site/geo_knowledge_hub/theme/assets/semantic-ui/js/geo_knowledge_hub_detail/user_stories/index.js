/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import _last from "lodash/last";
import { getInputFromDOM } from "react-invenio-deposit";

import { UserStoriesTable } from "@geo-knowledge-hub/geo-components-react";

/**
 * Render the User Stories component.
 */
export const renderComponent = (...args) => {
  // Extracting package info (Assuming the url is the package id)
  const currentPackageId = _last(window.location.pathname.split("/"));

  // Extracting the engagement values
  const componentDiv = document.getElementById("usertStories");
  const userStoriesData = getInputFromDOM("userStoriesData") || [];

  if (componentDiv && userStoriesData.length > 0) {
    // Rendering!
    ReactDOM.render(
      <UserStoriesTable tableData={userStoriesData} packageId={currentPackageId} />,
      componentDiv,
    );
  }
};
