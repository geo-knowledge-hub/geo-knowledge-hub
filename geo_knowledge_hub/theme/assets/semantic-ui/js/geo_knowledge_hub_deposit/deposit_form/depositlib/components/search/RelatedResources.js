/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { connect } from "react-redux";
import React, { Component } from "react";

import {
  Error,
  EmptyResults,
  ResultsLoader,
  ResultsList,
  ReactSearchKit,
  InvenioSearchApi,
  SearchBar,
  Pagination,
  ResultsPerPage,
  withState,
} from "react-searchkit";

import { Grid, Button, Segment } from "semantic-ui-react";
import { i18next } from "@translations/invenio_app_rdm/i18next";

import { geoGlobalContext } from "../../../configStore";

export const ResultLoader = () => {
  return (
    <ResultsLoader>
      <EmptyResults />
      <Error />
      <ResultsList />
    </ResultsLoader>
  );
};

// redux store config
const mapStateToProps = (state) => ({
  knowledgePackage: state.knowledgePackage,
  resourcePublishIsPublished: state.resourcePublishIsPublished,
});

class _UpdateComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.resourcePublishIsPublished) {
      // updating the record search
      this.props.updateQueryState({
        queryString: this.props.currentQueryState.queryString,
      });
    }

    return <div></div>;
  }
}

const __UpdateComponent = withState(_UpdateComponent);

const UpdateComponent = connect(mapStateToProps, null, null, {
  context: geoGlobalContext,
})(__UpdateComponent);

export class RelatedResources extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const searchApi = new InvenioSearchApi(this.props.searchConfig.searchApi);

    return (
      <ReactSearchKit
        searchApi={searchApi}
        eventListenerEnabled={true}
        urlHandlerApi={{ enabled: false }}
        initialQueryState={this.props.searchConfig.initialQueryState}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={8}>
              <SearchBar
                placeholder="Enter any related resource name"
                currentQueryString={{ queryString: "" }}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Button
                color="green"
                icon="upload"
                content={i18next.t("New upload")}
                floated="right"
                onClick={this.props.modalWindowHandler}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered>
            <Grid.Column width={14}>
              <Segment>
                <ResultLoader />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8} textAlign="center">
              <Pagination
                options={{
                  size: "mini",
                  showFirst: false,
                  showLast: false,
                }}
              />
            </Grid.Column>
            <Grid.Column textAlign="right" width={4}>
              <ResultsPerPage
                values={
                  this.props.searchConfig.paginationOptions.resultsPerPage
                }
                label={(cmp) => <> {cmp} results per page</>}
              />
            </Grid.Column>
          </Grid.Row>
          <UpdateComponent />
        </Grid>
      </ReactSearchKit>
    );
  }
}
