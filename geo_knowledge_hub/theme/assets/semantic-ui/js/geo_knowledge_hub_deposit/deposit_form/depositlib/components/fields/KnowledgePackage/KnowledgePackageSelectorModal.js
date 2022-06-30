/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { Formik } from "formik";
import React, { Component } from "react";

import { Modal, Grid, Header } from "semantic-ui-react";

import {
  ReactSearchKit,
  SearchBar,
  InvenioSearchApi,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
} from "react-searchkit";

import { ActionButton } from "react-invenio-forms";
import { KnowledgePackageResults } from "./KnowledgePackageResults";

const ModalActions = {
  ADD: "add",
  EDIT: "edit",
};

const initialState = {
  sortBy: "bestmatch",
  sortOrder: "asc",
  layout: "list",
  page: 1,
  size: 75,
};

export class KnowledgePackageSelectorModal extends Component {
  state = {
    open: false,
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  onSubmit = (values, formikBag) => {
    this.props.onPackageChange(values.selectedKnowledgePackage);
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    this.closeModal();
  };

  render() {
    const initialKnowledgePackage = this.props.initialKnowledgePackage || {
      identifier: null,
      relation_type: "ispartof",
      resource_type: "knowledge",
      scheme: "doi",
    };

    const searchApi = new InvenioSearchApi(this.props.searchConfig.searchApi);
    return (
      <Formik
        initialValues={{
          selectedKnowledgePackage: initialKnowledgePackage,
        }}
        onSubmit={this.onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Modal
          onOpen={() => this.openModal()}
          open={this.state.open}
          trigger={this.props.trigger}
          onClose={this.closeModal}
          closeIcon
        >
          <Modal.Header as="h6" className="deposit-modal-header">
            <Grid>
              <Grid.Column floated="left">
                <Header as="h2">
                  {this.props.action === ModalActions.ADD
                    ? `Add Knowledge Package`
                    : `Change the Knowledge Package`}
                </Header>
              </Grid.Column>
            </Grid>
          </Modal.Header>
          <Modal.Content scrolling>
            {
              <ReactSearchKit
                searchApi={searchApi}
                appName={"knowledgepackages"}
                urlHandlerApi={{ enabled: false }}
                initialQueryState={initialState}
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column
                      width={8}
                      floated="left"
                      verticalAlign="middle"
                    >
                      <SearchBar
                        placeholder={"Search for a Knowledge Package"}
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
                        <EmptyResults />
                        <Error />
                        <KnowledgePackageResults
                          {...(this.props.serializeKnowledgePackage && {
                            serializeKnowledgePackage:
                              this.props.serializeKnowledgePackage,
                          })}
                        />
                      </ResultsLoader>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column textAlign="center">
                      <Pagination
                        options={{
                          size: "mini",
                          showFirst: false,
                          showLast: false,
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </ReactSearchKit>
            }
          </Modal.Content>
          <Modal.Actions>
            <ActionButton
              name="cancel"
              onClick={(values, formikBag) => {
                formikBag.resetForm();
                this.closeModal();
              }}
              icon="remove"
              content={"Cancel"}
              floated="left"
            />
            <ActionButton
              name="submit"
              onClick={(event, formik) => formik.handleSubmit(event)}
              primary
              icon="checkmark"
              content={
                this.props.action === ModalActions.ADD
                  ? "Select the Knowledge Package"
                  : "Change the Knowledge Package"
              }
            />
          </Modal.Actions>
        </Modal>
      </Formik>
    );
  }
}
