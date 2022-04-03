/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2019-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";
import { getInputFromDOM } from "react-invenio-deposit";

import natsort from "natsort";

import { EngagementPrioritiesCarousel } from "geo-labels-react";

// Extracting the engagement values
const recordEngagements = getInputFromDOM("record-engagements");

// Sorting the values
const natsorter = natsort({ insensitive: true });

const recordEngagementSorted = recordEngagements.sort((a, b) =>
  natsorter(a.id, b.id)
);

// Rendering!
ReactDOM.render(
  <EngagementPrioritiesCarousel
    carouselImageClass={"carousel-image"}
    engagementPriorities={recordEngagementSorted}
  />,
  document.getElementById("sidebar-engagements")
);
