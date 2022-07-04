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
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";

import { EngagementPrioritiesNestedCarousel } from "@geo-knowledge-hub/geo-components-react";

/**
 * Styles
 */
const theme = {
  slides: {
    headerClass: "",
    slideBodyClass: css`
      margin: 5px;
    `,
    slideContainerClass: "",
    slideImageClass: "",
  },
  carousels: {},
};

/**
 * Styled components
 */
const EngagementCarouselDiv = styled("div")`
  width: 780px;
  height: auto;
`;

const ConventionsCarouselDiv = styled("div")`
  width: 600px;
  height: auto;
`;

const engagementsDiv = document.getElementById("engagementsSearchOptions");
const conventionsDiv = document.getElementById("engagementsConventionSearchOptions");

// carousel components configuration
const nestedCarouselContainerProps = {
  animation: "scale down",
  direction: "bottom",
};

const nestedCarouselProps = {
  visibleSlides: 6,
};

const proxies = {
  dataProxyProcessor: (dataset) => {
    return dataset.map((data) => ({
      ...data,
      props: {
        ...data.props,
        icon: data.props.icon ? `/static/${data.props.icon}` : "",
      },
    }));
  }
};

// rendering!
if (engagementsDiv) {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <EngagementCarouselDiv>
        <EngagementPrioritiesNestedCarousel
          nestedCarouselContainerProps={nestedCarouselContainerProps}
          mainCarouselProps={{
            naturalSlideWidth: 1,
            naturalSlideHeight: 1.15,
            visibleSlides: 4,
          }}
          nestedCarouselProps={nestedCarouselProps}
          proxies={{
            ...proxies,
            prepareSearchParams: (searchParams, isPrincipalCarousel) => {
              // specific rules
              if (!isPrincipalCarousel) {
                if (searchParams.params.q.includes("sdg")) {
                  // to avoid errors in the front page
                  searchParams.params.q = `${searchParams.params.q} AND props.subtype:sdg-goal`;
                }
              } else {
                searchParams.params.q = `${searchParams.params.q} AND (NOT props.engagement_type:convention)`;
              }
              return searchParams;
            },
          }}
        />
      </EngagementCarouselDiv>
    </ThemeProvider>,
    engagementsDiv
  );
}

if (conventionsDiv) {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <ConventionsCarouselDiv>
        <EngagementPrioritiesNestedCarousel
          mainCarouselProps={{
            naturalSlideWidth: 1,
            naturalSlideHeight: 1.15,
            visibleSlides: 3,
          }}
          nestedCarouselProps={nestedCarouselProps}
          proxies={{
            ...proxies,
            prepareSearchParams: (searchParams, isPrincipalCarousel) => {
              // specific rules
              searchParams.params.q = `${searchParams.params.q} AND props.engagement_type:convention`;
              return searchParams;
            },
          }}
        />
      </ConventionsCarouselDiv>
    </ThemeProvider>,
    conventionsDiv
  );
}
