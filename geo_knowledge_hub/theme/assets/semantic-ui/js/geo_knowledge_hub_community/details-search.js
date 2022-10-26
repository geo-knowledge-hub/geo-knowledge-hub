/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { createSearchAppInit } from "@js/invenio_search_ui";
import {
  CommunitiesFacetsValues,
  CommunityBucketAggregationElement,
  CommunityCountComponent,
  CommunityEmptyResults,
  CommunityErrorComponent,
  CommunityRecordFacets,
  CommunityRecordResultsGridItem,
  CommunityRecordSearchAppLayout,
  CommunityRecordSearchBarElement,
  CommunityToggleComponent,
} from "@js/invenio_communities/details_search/components";

import { CommunityRecordResultsListItem } from "./components";

createSearchAppInit({
  "BucketAggregation.element": CommunityBucketAggregationElement,
  "BucketAggregationValues.element": CommunitiesFacetsValues,
  "ResultsGrid.item": CommunityRecordResultsGridItem,
  "EmptyResults.element": CommunityEmptyResults,
  "ResultsList.item": CommunityRecordResultsListItem,
  "SearchApp.facets": CommunityRecordFacets,
  "SearchApp.layout": CommunityRecordSearchAppLayout,
  "SearchBar.element": CommunityRecordSearchBarElement,
  "Count.element": CommunityCountComponent,
  "Error.element": CommunityErrorComponent,
  "SearchFilters.Toggle.element": CommunityToggleComponent,
});
