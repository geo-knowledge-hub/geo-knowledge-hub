/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";
import { getInputFromDOM } from "@geo-knowledge-hub/react-invenio-deposit";

import { UserStoriesCarousel } from "@geo-knowledge-hub/geo-components-react";

// Extracting the engagement values
const userStories = getInputFromDOM("user-stories") || [];

// Rendering!
ReactDOM.render(
  <UserStoriesCarousel
    userStories={userStories}
    carouselProps={{
      naturalSlideWidth: 2,
      naturalSlideHeight: 1.5,
      totalSlides: userStories.length,
      visibleSlides: 3,
      isPlaying: userStories.length > 3,
      interval: 5000, // ms
      isIntrinsicHeight: true,
      infinite: true,
    }}
    cardGroupProps={{
      slides: userStories.length,
    }}
    cardCarouselProps={{
      raised: true,
      color: "blue",
      centered: true,
      fluid: false,
      style: {
        width: "300px",
        height: "150px",
      },
    }}
  />,
  document.getElementById("section-user-stories")
);
