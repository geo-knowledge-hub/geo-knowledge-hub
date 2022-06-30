/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { css } from "@emotion/css";
import { ThemeProvider } from "@emotion/react";

import { getInputFromDOM } from "@geo-knowledge-hub/react-invenio-deposit";

import { EngagementPrioritiesCarousel } from "@geo-knowledge-hub/geo-components-react";

/**
 * Render the Engagement Priorities component.
 */
export const renderComponent = (...args) => {
  // Extracting the engagement values
  const componentDiv = document.getElementById("recordEngagements");
  const recordEngagements = getInputFromDOM("recordEngagementsData");

  let recordEngagementsData = recordEngagements;

  // Removing data to avoid errors in the interface
  if (recordEngagements) {
    recordEngagementsData = recordEngagements.filter(
      (x) => !(["", null].indexOf(x.props.icon) > -1)
    );
  }

  if (recordEngagementsData.length > 0) {
    // Preparing the theme
    const theme = {
      slides: {
        slideImageClass: css`
          transform: scale(0.8, 0.8);
          -ms-transform: scale(0.8, 0.8);
          -webkit-transform: scale(0.8, 0.8);
        `,
      },
    };

    // Rendering!
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <EngagementPrioritiesCarousel
          engagementPriorities={recordEngagementsData}
          cardProps={{ header: null, style: { boxShadow: "none" } }}
          carouselProviderProps={{ naturalSlideHeight: 1 }}
        />
      </ThemeProvider>,
      componentDiv
    );
  } else {
    // temporary
    document.getElementById("engagement-priorities-sidebar").remove();
  }
};
