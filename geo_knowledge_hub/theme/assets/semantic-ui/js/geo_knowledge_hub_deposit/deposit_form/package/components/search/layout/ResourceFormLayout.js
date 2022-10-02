// This file is part of InvenioRDM
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
// Copyright (C) 2021 New York University.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from "react";

import { Grid } from "semantic-ui-react";
import { withState, SearchBar } from "react-searchkit";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { SearchAppResultsPane } from "@js/invenio_search_ui/components";

import { FacetBaseType } from "../facets";
import { ResourceFormContext } from "../../../context";

/**
 * Modal refresher component.
 *
 * (Initial approach)
 */
const SearchRefresherComponent = ({ ...props }) => {
  if (props.search.state.updateSearch) {
    props.search.setState({ updateSearch: false });

    setTimeout(() => {
      props.updateQueryState(props.currentQueryState);
    }, 200);
  }

  return <></>;
};

export const SearchRefresherContextualized = ({ ...props }) => (
  <ResourceFormContext.Consumer>
    {(value) => <SearchRefresherComponent {...{ ...props, ...value }} />}
  </ResourceFormContext.Consumer>
);

const SearchRefresher = withState(SearchRefresherContextualized);

/**
 * Header selector for the search layout
 *
 * (Initial approach)
 */
const HeaderSelector = () => (
  <ResourceFormContext.Consumer>
    {(value) => <>{value.header}</>}
  </ResourceFormContext.Consumer>
);

/**
 * Layout component for the Resources form interface.
 * @constructor
 */
export const ResourceFormLayout = () => (
  <>
    <Grid stackable>
      <Grid.Row>
        <Grid.Column mobile={14} tablet={10} computer={4}>
          <HeaderSelector />
        </Grid.Column>
        <Grid.Column
          mobile={14}
          tablet={10}
          computer={12}
          floated={"right"}
          verticalAlign={"middle"}
        >
          <SearchBar
            placeholder={i18next.t("Search for resources inside the package")}
          />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column mobile={14} tablet={10} computer={4} centered>
          <FacetBaseType />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={16} computer={12}>
          <SearchAppResultsPane />
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <SearchRefresher />
  </>
);
