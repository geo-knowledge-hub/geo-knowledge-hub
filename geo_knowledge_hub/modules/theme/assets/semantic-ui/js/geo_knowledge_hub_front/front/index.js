/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2019-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";
import { getInputFromDOM } from "@geo-knowledge-hub/react-invenio-deposit";

import natsort from "natsort";

import { EngagementPrioritiesCarousel } from "@geo-knowledge-hub/geo-components-react";

// Extracting the engagement values
const recordEngagements = getInputFromDOM("record-engagements");

var stringContent = recordEngagements.hits.hits.filter(
  (val) => !/\d/g.test(val.id)
);

var numericalContent = recordEngagements.hits.hits.filter((val) =>
  /\d/g.test(val.id)
);

// Sorting the numerical values
const natsorter = natsort();
numericalContent.sort((a, b) => natsorter(a.id, b.id));

// Rendering!
ReactDOM.render(
  <EngagementPrioritiesCarousel
    carouselImageClass={"carousel-image"}
    engagementPriorities={[...stringContent, ...numericalContent]}
    gliderProps={{
      draggable: true,
      dragVelocity: 3,
      hasDots: true,
      hasArrows: true,
      slidesToShow: 5,
      slidesToScroll: 3,
      duration: 1.2,
      iconLeft: " ",
      iconRight: " ",
    }}
  />,
  document.getElementById("front-engagements")
);
