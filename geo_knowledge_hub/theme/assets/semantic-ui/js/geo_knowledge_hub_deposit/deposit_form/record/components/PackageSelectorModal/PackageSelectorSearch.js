/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";

import {
  EmptyResults,
  Error,
  InvenioSearchApi,
  Pagination,
  ReactSearchKit,
  ResultsList,
  ResultsLoader,
  SearchBar,
} from "react-searchkit";

import { OverridableContext } from "react-overridable";
import { Container, Grid, Menu, Segment, Modal } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { PackageSelectorListItem } from "./PackageSelectorListItem";

const overriddenComponents = {
  "communities.ResultsList.item": PackageSelectorListItem,
};

/**
 * Component to search for user packages.
 *
 * @note This Component was created based on ``CommunitySelectionSearch``
 *       from React Invenio Deposit.
 */
export const PackageSelectorSearch = () => {
  // Base definitions
  const apiEndpoints = {
    userPackages: "/api/user/packages",
  };

  // Currently, we only support packages from the user.
  // In a future version, we can use the "Invenio requests"
  // and integrate it with the Packages API.
  const defaultEndpoint = apiEndpoints.userPackages;

  // States
  const [selectedEndpoint, setSelectedEndpoint] = useState(defaultEndpoint);

  // Placeholder fixed
  const searchbarPlaceholder = i18next.t("Search my packages");

  const searchApi = new InvenioSearchApi({
    axios: {
      url: selectedEndpoint,
      headers: {
        Accept: "application/vnd.inveniordm.v1+json",
      },
    },
  });

  return (
    <OverridableContext.Provider value={overriddenComponents}>
      <ReactSearchKit
        appName="communities"
        urlHandlerApi={{ enabled: false }}
        searchApi={searchApi}
        key={selectedEndpoint}
        initialQueryState={{
          size: 5,
          page: 1,
          filters: [["is_published", false]],
        }}
      >
        <Grid>
          <Grid.Row verticalAlign="middle">
            <Grid.Column width={8} textAlign="left" floated="left">
              <Menu compact>
                <Menu.Item
                  name="My packages"
                  active={true} // fixed in this version
                >
                  {i18next.t("My packages")}
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column width={8} floated="right" verticalAlign="middle">
              <SearchBar
                placeholder={searchbarPlaceholder}
                autofocus
                actionProps={{
                  icon: "search",
                  content: null,
                  className: "search",
                }}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              <ResultsLoader>
                <Segment className="community-list-container p-0">
                  <Modal.Content scrolling className="community-list-results">
                    <EmptyResults />
                    <Error />
                    <ResultsList />
                  </Modal.Content>
                </Segment>
                <Container textAlign="center">
                  <Pagination />
                </Container>
              </ResultsLoader>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </ReactSearchKit>
    </OverridableContext.Provider>
  );
};
