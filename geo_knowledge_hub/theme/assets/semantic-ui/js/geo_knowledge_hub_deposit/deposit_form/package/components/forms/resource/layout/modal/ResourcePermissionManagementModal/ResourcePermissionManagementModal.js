/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { useStore } from "react-redux";

import { Formik } from "formik";
import { Modal, Grid, Header } from "semantic-ui-react";

import {
  EmptyResults,
  Error,
  InvenioSearchApi,
  ReactSearchKit,
  ResultsLoader,
  SearchBar,
} from "react-searchkit";

import { i18next } from "@translations/geo_knowledge_hub/i18next";
import { InvenioSearchPagination } from "@js/invenio_search_ui/components";

import { ResultItemHOC } from "./results";

import { DepositMessage } from "../../messages";
import { ComponentMessageId } from "./messages";

class PermissionManagementComponent extends Component {
  render() {
    // Props (Modal operation)
    const { store, modalOpen, modalOnClose, modalPackageRecord } = this.props;

    // Auxiliary components
    const ResultItem = ResultItemHOC(store);

    return (
      <Formik
        initialValues={{
          selectedResource: {},
        }}
        onSubmit={() => {}}
        resetForm={true}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Modal
          open={modalOpen}
          closeIcon
          closeOnEscape
          closeOnDimmerClick
          onClose={() => {
            modalOnClose();
          }}
          size={"large"}
        >
          <Modal.Header as="h6" className="pt-10 pb-10">
            <Grid>
              <Grid.Column floated="left">
                <Header as="h2">{i18next.t("Permission management")}</Header>
              </Grid.Column>
            </Grid>
          </Modal.Header>

          <Modal.Content scrolling>
            <Grid.Row className={"mb-5"}>
              <Grid.Column mobile={16} tablet={16} computer={16}>
                <DepositMessage componentId={ComponentMessageId} />
              </Grid.Column>
            </Grid.Row>

            <ReactSearchKit
              searchApi={
                new InvenioSearchApi({
                  axios: {
                    headers: {
                      Accept: "application/vnd.inveniordm.v1+json",
                    },
                    withCredentials: true,
                    url: modalPackageRecord.links.resources,
                  },
                })
              }
              searchOnInit={true}
              appName={`permission-management-modal`}
              urlHandlerApi={{ enabled: false }}
              initialQueryState={{
                page: 1,
                size: 3,
              }}
            >
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16} verticalAlign={"middle"}>
                    <SearchBar
                      placeholder={i18next.t("Search for a resource")}
                      autofocus
                      actionProps={{
                        icon: "search",
                        content: null,
                        className: "search",
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column>
                    <ResultsLoader>
                      <EmptyResults />
                      <Error />
                      <ResultItem />
                    </ResultsLoader>
                  </Grid.Column>
                </Grid.Row>
                <InvenioSearchPagination
                  paginationOptions={{
                    resultsPerPage: [
                      {
                        text: "3",
                        value: 3,
                      },
                      {
                        text: "5",
                        value: 5,
                      },
                      {
                        text: "10",
                        value: 10,
                      },
                      {
                        text: "15",
                        value: 15,
                      },
                    ],
                  }}
                />
              </Grid>
            </ReactSearchKit>
          </Modal.Content>
        </Modal>
      </Formik>
    );
  }
}

export const ResourcePermissionManagementModal = ({ ...args }) => {
  const reduxStore = useStore();

  return <PermissionManagementComponent store={reduxStore} {...args} />;
};
