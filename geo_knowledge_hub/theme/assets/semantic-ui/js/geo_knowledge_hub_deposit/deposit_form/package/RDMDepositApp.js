// This file is part of InvenioRDM
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021-2022 Graz University of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { Container, Step, Icon } from "semantic-ui-react";

import {
  RDMCountComponent,
  RDMToggleComponent,
  RDMRecordSearchBarElement,
} from "@invenio-app-rdm/search/components";
import { DashboardResultView } from "@invenio-app-rdm/user_dashboard/base";

import {
  PackageDepositForm,
  ResourceFormNoResults,
  ResourceFormLayout,
  ResourcesDepositForm,
  ResourceResultsListItem,
} from "./components";

import { updateReactSearchKitStore } from "./configuration";

/**
 * Configuring the search components to be used in the Resource form
 */
updateReactSearchKitStore({
  "Count.element": RDMCountComponent,
  "EmptyResults.element": ResourceFormNoResults,
  "ResultsList.item": ResourceResultsListItem,
  "SearchApp.layout": ResourceFormLayout,
  "SearchApp.results": DashboardResultView,
  "SearchBar.element": RDMRecordSearchBarElement,
  "SearchFilters.Toggle.element": RDMToggleComponent,
});

/**
 * RDM Deposit App for Packages.
 */
export class RDMDepositApp extends Component {
  constructor(props) {
    super(props);

    // app status
    this.state = {
      selectedWindow: "package", // or "resources"
      packageRecord: props.record || {},
    };
  }

  /**
   * Factory of function to update the package record.
   */
  updatePackageRecord() {
    return (record) => {
      this.setState({ ...this.state, packageRecord: record });
    };
  }

  render() {
    // Creating the API Url for an already generated package
    let resourceFormConfiguration = { ...this.props };

    // When package is already defined is possible to define
    // the API Urls for the resources.
    const packageRecordId = this.state.packageRecord.id;
    if (packageRecordId) {
      resourceFormConfiguration.config.apiUrl =
        this.state.packageRecord.links.resources;
      resourceFormConfiguration.configRecordSearch.searchApi.axios.url =
        this.state.packageRecord.links.resources;
    }

    return (
      <Container className="rel-mt-2">
        <div>
          {this.state.selectedWindow === "package" ? (
            <PackageDepositForm
              headerSelector={
                <Step.Group fluid>
                  <Step
                    link
                    disabled={!packageRecordId}
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        selectedWindow: "resources",
                      });
                    }}
                  >
                    <Icon name="boxes" />
                    <Step.Content>
                      <Step.Title>{i18next.t("Go to resources")}</Step.Title>
                    </Step.Content>
                  </Step>
                </Step.Group>
              }
              onRecordChange={this.updatePackageRecord()}
              {...this.props}
            />
          ) : (
            <ResourcesDepositForm
              headerSelector={
                <Step.Group fluid size={"small"}>
                  <Step
                    link
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        selectedWindow: "package",
                      });
                    }}
                  >
                    <Icon name="box" />
                    <Step.Content>
                      <Step.Title>{i18next.t("Back to package")}</Step.Title>
                    </Step.Content>
                  </Step>
                </Step.Group>
              }
              {...resourceFormConfiguration}
            />
          )}
        </div>
      </Container>
    );
  }
}

RDMDepositApp.propTypes = {
  config: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  preselectedCommunity: PropTypes.object,
  files: PropTypes.object,
  permissions: PropTypes.object,
};

RDMDepositApp.defaultProps = {
  preselectedCommunity: undefined,
  permissions: null,
  files: null,
};
