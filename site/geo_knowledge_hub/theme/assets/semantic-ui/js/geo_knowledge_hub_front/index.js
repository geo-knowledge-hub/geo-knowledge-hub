/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2023 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  LatestEvents,
  LatestRecords,
  AdvancedSearchBar,
  EngagementCarousel,
  ConventionsCarousel,
} from "@geo-knowledge-hub/geo-components-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

//
// URL element
//
const isMarketplace = window.location.pathname.includes("marketplace");

//
// DOM element selection
//
const searchDiv = document.getElementById("advanced-search-div");
const searchData = document.getElementById("front-search-data");

const engagementsDiv = document.getElementById("engagementsSearchOptions");
const conventionsDiv = document.getElementById(
  "engagementsConventionSearchOptions",
);

const latestRecordsDiv = document.getElementById("latestRecordsSearchOptions");
const latestNewsDiv = document.getElementById("latestEventsSearchOptions");

//
// Configuration
//

// Query client (Dynamic)
const dynamicQueryClient = new QueryClient();

// Query client (Persistent)
const persistentQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 604800000, // 1 week
    },
  },
});

// Default Record type
let recordType = "package";

if (isMarketplace) {
  recordType = "marketplace-item";
}

// rendering!
if (searchDiv && searchData) {
  const baseUrl = searchData.value;

  ReactDOM.render(
    <AdvancedSearchBar
      onSearch={(query) => {
        if (query === "q=" && isMarketplace) {
          query = "q=parent.type:(marketplace-item)"
        }

        window.location.assign(`${baseUrl}?${query}`);
      }}
      searchPlaceholder={i18next.t(
        "Search for Earth Observations Applications",
      )}
      formInitialValues={{
        form: {
          recordTypes: [
            recordType
          ],
        },
      }}
      tabConfigurations={{
        tabPaneConfig: {
          basicFormPane: {},
          spatialFormPane: {
            fieldConfig: {
              label: (
                <span className={"leaflet-text-tooltip leaflet-pm-toolbar"}>
                  You can select the area you want to search by using the rectangle icon (
                  <span className="rectangle-icon leaflet-pm-icon-rectangle"></span>
                  ) in the map below.
                </span>
              ),
              labelIcon: "map",
            },
          },
        },
      }}
    />,
    searchDiv,
  );
}

if (engagementsDiv) {
  ReactDOM.render(
    <QueryClientProvider client={persistentQueryClient}>
      <div className={"carousel-container"}>
        <EngagementCarousel filterUrl={engagementsDiv.dataset.searchConfig} />
      </div>
    </QueryClientProvider>,
    engagementsDiv,
  );
}

if (conventionsDiv) {
  ReactDOM.render(
    <QueryClientProvider client={persistentQueryClient}>
      <div className={"carousel-container"}>
        <ConventionsCarousel filterUrl={conventionsDiv.dataset.searchConfig} />
      </div>
    </QueryClientProvider>,
    conventionsDiv,
  );
}

if (latestRecordsDiv) {
  const latestRecordsConfig = JSON.parse(latestRecordsDiv.dataset.searchConfig);

  ReactDOM.render(
    <QueryClientProvider client={dynamicQueryClient}>
      <div className={"latest-records-container"}>
        <LatestRecords
          fetchUrl={latestRecordsConfig.url}
          moreUrl={latestRecordsConfig.url_more}
        />
      </div>
    </QueryClientProvider>,
    latestRecordsDiv,
  );
}

if (latestNewsDiv) {
  const latestNewsConfig = JSON.parse(latestNewsDiv.dataset.searchConfig);

  ReactDOM.render(
    <QueryClientProvider client={dynamicQueryClient}>
      <div className={"latest-events-container"}>
        <LatestEvents
          fetchUrl={latestNewsConfig.url}
          moreUrl={latestNewsConfig.url_more}
        />
      </div>
    </QueryClientProvider>,
    latestNewsDiv,
  );
}
