/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

// import { getInputFromDOM } from "react-invenio-deposit";

import { css } from "@emotion/css";
import { ThemeProvider } from "@emotion/react";

import { RelatedLinkCarousel } from "@geo-knowledge-hub/geo-components-react";

/**
 * Styles
 */
const theme = {
  slides: {
    slideBodyClass: css`
      margin: 10px;
    `,
  },
};

const detailsListDiv = document.getElementById("details-list-div");

/**
 * Render the Engagement Priorities component.
 */
export const renderComponent = (...args) => {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <RelatedLinkCarousel
        contentData={JSON.parse(detailsListDiv.dataset.relatedIdentifiers)}
        carouselProviderProps={{
          visibleSlides: 2,
          naturalSlideWidth: 1,
          naturalSlideHeight: 0.55,
          dragEnabled: false,
        }}
        cardProps={{
          fluid: true,
          style: {
            minHeight: "200px",
          },
        }}
      />
    </ThemeProvider>,
    detailsListDiv
  );
};
