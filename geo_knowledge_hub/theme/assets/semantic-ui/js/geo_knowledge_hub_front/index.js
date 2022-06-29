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
const CarouselDiv = styled("div")`
  width: 780px;
  height: auto;
`;

const componentDiv = document.getElementById("engagementsSearchOptions");

if (componentDiv) {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CarouselDiv>
        <EngagementPrioritiesNestedCarousel
          nestedCarouselContainerProps={{
            animation: "scale down",
            direction: "bottom",
          }}
          mainCarouselProps={{
            visibleSlides: 4,
            naturalSlideWidth: 1,
            naturalSlideHeight: 1.25,
          }}
          nestedCarouselProps={{
            visibleSlides: 6,
          }}
          proxies={{
            dataProxyProcessor: (dataset) => {
              return dataset.map((data) => ({
                ...data,
                props: {
                  ...data.props,
                  icon: data.props.icon ? `/static/${data.props.icon}` : "",
                },
              }));
            },
            prepareSearchParams: (searchParams, isPrincipalCarousel) => {
              // specific rules
              if (!isPrincipalCarousel) {
                if (searchParams.params.q.includes("sdg")) {
                  // to avoid errors in the front page
                  searchParams.params.q = `${searchParams.params.q} AND props.subtype:sdg-goal`;
                }
              }
              return searchParams;
            },
          }}
        />
      </CarouselDiv>
    </ThemeProvider>,
    componentDiv
  );
}
