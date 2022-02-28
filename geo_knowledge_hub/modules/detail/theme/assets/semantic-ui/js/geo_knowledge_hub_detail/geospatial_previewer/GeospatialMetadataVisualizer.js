/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _ from "lodash";

import React, { Component } from "react";
import { InteractiveMap } from "geo-metadata-previewer-react";

/**
 * Interactive Map class for the GEO Knowledge Hub Record Landing page.
 */
export class GeospatialMetadataVisualizer extends Component {
  render() {
    // extracting the properties
    const { record } = this.props;

    // organizing the locations
    let recordLocationsObject = {};
    const recordLocations = record.metadata.locations;

    if (!_.isEmpty(recordLocations)) {
      // getting the locations that have an spatial geometry associated
      const recordLocationsWithGeometry = recordLocations.features.filter(
        (item) => {
          return _.has(item, "geometry");
        }
      );

      // preparing the GeoJSON object.
      recordLocationsObject = {
        type: "FeatureCollection",
        features: recordLocationsWithGeometry.map((x) => {
          return { type: "Feature", ...x };
        }),
      };
    }

    return (
      <InteractiveMap
        mapContainerOptions={{
          id: "map-container",
          scrollWheelZoom: true,
        }}
        geoJSONData={recordLocationsObject}
      />
    );
  }
}
