/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";
import { getInputFromDOM } from "react-invenio-deposit";

import { RelatedApplicationCarousel } from "geo-labels-react";

// Extracting the engagement values
const relatedApplications = getInputFromDOM("record-applications") || [];

// Rendering!
ReactDOM.render(
  <RelatedApplicationCarousel
    relatedApplications={relatedApplications}
    carouselProps={{
      naturalSlideWidth: 2,
      naturalSlideHeight: 1.5,
      totalSlides: relatedApplications.length,
      visibleSlides: 3,
      isPlaying: true,
      interval: 5000, // ms
      isIntrinsicHeight: true,
    }}
    cardGroupProps={{
      slides: relatedApplications.length,
    }}
    cardCarouselProps={{
      raised: true,
      color: "blue",
      centered: true,
      fluid: false,
      style: {
        // Initial test style
        width: "300px",
        height: "150px",
      },
    }}
  />,
  document.getElementById("section-record-applications")
);
