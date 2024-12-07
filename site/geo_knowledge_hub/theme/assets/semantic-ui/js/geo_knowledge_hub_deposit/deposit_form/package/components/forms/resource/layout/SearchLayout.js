/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import { Grid } from "semantic-ui-react";
import { SearchBar } from "react-searchkit";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { SearchAppResultsPane } from "@js/invenio_search_ui/components";

import { MenuFacetTypeHOC, MenuOperationsHOC, MenuManagementHOC } from "./menu";

import { SearchRefresherHOC } from "./search";

/**
 * Layout component for the Resources form interface.
 * @constructor
 */
export class SearchLayout extends Component {
  render() {
    // Props (Redux)
    const { store } = this.props;

    // Props (Layout components)
    const { formActivator } = this.props;

    // Auxiliary components
    const MenuFacetType = MenuFacetTypeHOC(store);
    const MenuManagement = MenuManagementHOC(store);
    const MenuOperations = MenuOperationsHOC(store);
    const SearchRefresher = SearchRefresherHOC(store);

    return (
      <>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={4}>
              {formActivator}
            </Grid.Column>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={12}
              floated={"right"}
              verticalAlign={"middle"}
            >
              <SearchBar
                placeholder={i18next.t(
                  "Search for Knowledge Resources available in the Package",
                )}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={4} centered>
              <MenuFacetType />
              <MenuManagement />
              <MenuOperations />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={12}>
              <SearchAppResultsPane />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/*
          Auxiliary component to update the search component using the pre-existing structure.
          In the future, probably we need to revise and improve this!
         */}
        <SearchRefresher />
      </>
    );
  }
}

export const SearchLayoutHOC = (store, formActivator) => {
  return ({ ...args }) => (
    <SearchLayout store={store} formActivator={formActivator} {...args} />
  );
};
