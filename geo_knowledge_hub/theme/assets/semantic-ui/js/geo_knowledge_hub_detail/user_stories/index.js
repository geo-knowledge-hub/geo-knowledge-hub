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

import { UserStoryCarousel as UserStoriesCarousel } from "@geo-knowledge-hub/geo-components-react";

/**
 * Render the Usert Stories component.
 */
export const renderComponent = (...args) => {
  // Extracting the engagement values
  const componentDiv = document.getElementById("usertStories");
  const userStoriesData = getInputFromDOM("userStoriesData") || [];

  if (componentDiv && userStoriesData.length > 0) {
    // Preparing the theme
    const theme = {
      slides: {
        slideBodyClass: css`
          margin: 10px;
        `,
      },
    };

    // Rendering!
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <UserStoriesCarousel
          userStories={userStoriesData}
          carouselProviderProps={{
            visibleSlides: 2,
            naturalSlideWidth: 1,
            naturalSlideHeight: 0.7,
            dragEnabled: false,
          }}
          cardProps={{
            style: {
              minHeight: "200px",
              minWidth: "350px",
              maxWidth: "400px",
            },
          }}
        />
      </ThemeProvider>,
      componentDiv
    );
  }
};
