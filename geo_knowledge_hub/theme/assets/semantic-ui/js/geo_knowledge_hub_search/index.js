/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { createSearchAppInit } from "@js/invenio_search_ui";
import { CustomRecordResultsListItem } from "./components";

import {
  RDMBucketAggregationElement,
  RDMCountComponent,
  RDMEmptyResults,
  RDMErrorComponent,
  RDMRecordFacets,
  RDMRecordFacetsValues,
  RDMRecordResultsGridItem,
  RDMRecordSearchBarContainer,
  RDMRecordMultipleSearchBarElement,
  RDMToggleComponent,
} from "@invenio-app-rdm/search/components";

createSearchAppInit({
  "BucketAggregation.element": RDMBucketAggregationElement,
  "BucketAggregationValues.element": RDMRecordFacetsValues,
  "ResultsGrid.item": RDMRecordResultsGridItem,
  "EmptyResults.element": RDMEmptyResults,
  "ResultsList.item": CustomRecordResultsListItem,
  "SearchApp.facets": RDMRecordFacets,
  "SearchApp.searchbarContainer": RDMRecordSearchBarContainer,
  "SearchBar.element": RDMRecordMultipleSearchBarElement,
  "Count.element": RDMCountComponent,
  "Error.element": RDMErrorComponent,
  "SearchFilters.Toggle.element": RDMToggleComponent,
});
