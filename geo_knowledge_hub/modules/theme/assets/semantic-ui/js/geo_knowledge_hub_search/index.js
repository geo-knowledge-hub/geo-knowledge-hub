/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2019-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { createSearchAppInit } from "@js/invenio_search_ui";
import { CustomRecordResultsListItem } from "./components";

import {
  RDMBucketAggregationElement,
  RDMRecordFacets,
  RDMRecordFacetsValues,
  RDMRecordResultsGridItem,
  RDMRecordSearchBarContainer,
  RDMRecordSearchBarElement,
  RDMCountComponent,
  RDMEmptyResults,
  RDMErrorComponent,
  RDMToggleComponent,
} from "@invenio-app-rdm/search/components";

const initSearchApp = createSearchAppInit({
  "BucketAggregation.element": RDMBucketAggregationElement,
  "BucketAggregationValues.element": RDMRecordFacetsValues,
  "ResultsGrid.item": RDMRecordResultsGridItem,
  "EmptyResults.element": RDMEmptyResults,
  "ResultsList.item": CustomRecordResultsListItem,
  "SearchApp.facets": RDMRecordFacets,
  "SearchApp.searchbarContainer": RDMRecordSearchBarContainer,
  "SearchBar.element": RDMRecordSearchBarElement,
  "Count.element": RDMCountComponent,
  "Error.element": RDMErrorComponent,
  "SearchFilters.ToggleComponent": RDMToggleComponent,
});
