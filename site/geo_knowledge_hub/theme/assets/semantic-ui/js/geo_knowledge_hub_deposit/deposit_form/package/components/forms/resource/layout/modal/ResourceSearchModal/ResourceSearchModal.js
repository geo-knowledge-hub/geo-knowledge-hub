/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import { useStore } from "react-redux";

import * as Yup from "yup";
import { Formik } from "formik";

import { Button, Grid, Header, Menu, Modal, Message } from "semantic-ui-react";

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
import { ConfirmationModal } from "../../../../../../../base/ConfirmationModal";

import { OperationTypes } from "../../../operations";

/**
 * Validation schema
 */
const SelectedResourceSchema = Yup.object().shape({
  selectedResource: Yup.object()
    .shape({
      id: Yup.string().required("ID is required"),
      title: Yup.string().required("Title is required"),
    })
    .required(),
});

/**
 * Modal to search for resources.
 */
class ResourceSearchModalComponent extends Component {
  constructor(props) {
    super(props);
    const { searchApiDefinitions } = this.props;

    // Properties
    this.searchApiDefinitions = searchApiDefinitions || {};

    // State
    this.state = {
      open: false,
      searchApiUrl: null,
      activeApiUrlName: null,
      confirmationModalOpen: false,
      confirmationModalData: {},
    };
  }

  openModal() {
    return this.setState({ ...this.state, open: true });
  }

  closeModal() {
    return this.setState({ ...this.state, open: false });
  }

  openConfirmationModal(title, content, onAccept, onRefuse) {
    return this.setState({
      ...this.state,
      confirmationModalOpen: true,
      confirmationModalData: {
        title,
        content,
        onAccept,
        onRefuse,
      },
    });
  }

  closeConfirmationModal() {
    return this.setState({
      ...this.state,
      confirmationModalOpen: false,
      confirmationModalData: {},
    });
  }

  changeSearchApiUrl(urlType) {
    const searchApiUrl = this.searchApiDefinitions[urlType];
    this.setState({ ...this.state, searchApiUrl, activeApiUrlName: urlType });

    if (this.state.open) {
      // Refreshing!
      setTimeout(() => {
        // We are doing this to refresh the React
        // Searchkit component.
        this.closeModal();
        this.openModal();
      }, 0);
    }
  }

  render() {
    // Props (Modal operation)
    const {
      store,
      modalOpen,
      modalData,
      modalOnClose,
      serializeResources,
      defaultSearchApiName,
      onResourceSelection,
    } = this.props;

    const { resourceType, resourceTypeName } = modalData;

    // Props (Confirmation modal operation)
    const { confirmationModalOpen, confirmationModalData } = this.state;

    // Props (Search operation)
    const { open, searchApiUrl, activeApiUrlName } = this.state;

    // Auxiliary components
    const ResultItem = ResultItemHOC(store);

    // Default active api url
    if (activeApiUrlName === null) {
      this.changeSearchApiUrl(defaultSearchApiName);
    }

    // Opening
    if (modalOpen && !this.state.open) {
      this.openModal();
    }

    return (
      <Formik
        initialValues={{
          selectedResource: {},
        }}
        onSubmit={(values, { resetForm }) => {
          if (values?.selectedResource?.id) {
            this.openConfirmationModal(
              i18next.t("Attach resource"),
              i18next.t(
                "Are you sure you want to associate the selected resource?",
              ),
              async () => {
                onResourceSelection(values?.selectedResource, {
                  type: OperationTypes.MENU_FACET_TYPE_OPERATION_TYPE,
                  id: resourceType,
                });

                modalOnClose();
                resetForm();

                await this.closeModal();
                await this.closeConfirmationModal();
              },
              async () => {
                await this.closeConfirmationModal();
              },
            );
          }
        }}
        resetForm={true}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={SelectedResourceSchema}
      >
        {({ errors, resetForm, handleSubmit }) => (
          <>
            <Modal
              open={open}
              onClose={() => {
                resetForm();

                modalOnClose();
                this.closeModal();
              }}
              closeIcon
              closeOnEscape
              closeOnDimmerClick
            >
              <Modal.Header as="h6" className="pt-10 pb-10">
                <Grid>
                  <Grid.Column floated="left">
                    <Header as="h2">
                      {i18next.t(`Select a resource (${resourceTypeName})`)}
                    </Header>
                  </Grid.Column>
                </Grid>
              </Modal.Header>
              <Modal.Content scrolling>
                {errors.selectedResource && (
                  <Grid>
                    <Grid.Row fluid>
                      <Grid.Column>
                        <Message negative>
                          <Message.Header>
                            {i18next.t("Error in attaching the resource")}
                          </Message.Header>
                          <p>
                            {i18next.t(
                              "You should select a resource before attaching it",
                            )}
                          </p>
                        </Message>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                )}
                <ReactSearchKit
                  searchApi={
                    new InvenioSearchApi({
                      axios: {
                        headers: {
                          Accept: "application/vnd.inveniordm.v1+json",
                        },
                        withCredentials: true,
                        url: searchApiUrl,
                      },
                    })
                  }
                  searchOnInit={true}
                  appName={`select-resources-${activeApiUrlName}`}
                  urlHandlerApi={{ enabled: false }}
                  initialQueryState={{
                    filters: [["resource_type", resourceType]],
                    page: 1,
                    size: 3,
                  }}
                >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column
                        width={8}
                        floated={"left"}
                        verticalAlign={"middle"}
                      >
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
                      <Grid.Column
                        width={8}
                        textAlign={"right"}
                        floated={"right"}
                      >
                        <Menu compact>
                          <Menu.Item
                            name={"record"}
                            as={Button}
                            primary
                            onClick={() => {
                              this.changeSearchApiUrl("resources");
                            }}
                            active={activeApiUrlName === "resources"}
                          >
                            {i18next.t("All resources")}
                          </Menu.Item>
                          <Menu.Item
                            name={"package"}
                            as={Button}
                            primary
                            onClick={() => {
                              this.changeSearchApiUrl("package");
                            }}
                            active={activeApiUrlName === "package"}
                          >
                            {i18next.t("Package resources")}
                          </Menu.Item>
                        </Menu>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign={"middle"}>
                      <Grid.Column>
                        <ResultsLoader>
                          <EmptyResults />
                          <Error />
                          <ResultItem
                            {...(serializeResources && {
                              serializeResources,
                            })}
                          />
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
              <Modal.Actions>
                <Button
                  name={"cancel"}
                  onClick={() => {
                    modalOnClose();
                    this.closeModal();
                  }}
                  icon={"remove"}
                  labelPosition={"left"}
                  content={i18next.t("Cancel")}
                  floated={"left"}
                />
                <Button
                  name={"submit"}
                  onClick={(event, values) => {
                    handleSubmit(event);
                  }}
                  primary
                  icon={"checkmark"}
                  labelPosition={"left"}
                  content={i18next.t("Attach the selected resource")}
                />
              </Modal.Actions>
            </Modal>

            <ConfirmationModal
              open={confirmationModalOpen}
              {...confirmationModalData}
            />
          </>
        )}
      </Formik>
    );
  }
}

export const ResourceSearchModal = ({ ...args }) => {
  const reduxStore = useStore();

  return <ResourceSearchModalComponent store={reduxStore} {...args} />;
};
