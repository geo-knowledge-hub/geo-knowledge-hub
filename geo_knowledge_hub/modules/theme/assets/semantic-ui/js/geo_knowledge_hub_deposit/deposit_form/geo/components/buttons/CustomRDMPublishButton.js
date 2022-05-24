// This file is adapted from React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from "lodash/get";
import { connect } from "react-redux";
import _isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import { ActionButton } from "react-invenio-forms";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Icon, Button, Modal, Message, Grid } from "semantic-ui-react";

import { AccessRightField } from "@geo-knowledge-hub/react-invenio-deposit";

import { geoGlobalStore } from "../../../configStore";

import {
  FORM_PUBLISHING,
  FORM_ACTION_EVENT_EMITTED,
  ACTION_SAVE_KNOWLEDGE_ENABLE,
} from "../../state/types";

export class CustomRDMPublishButtonComponent extends Component {
  state = { permissionsOpen: false, confirmOpen: false };

  /**
   * Modal handlers
   */
  handlePermissionsOpen = () =>
    this.setState({ ...this.state, permissionsOpen: true });
  handlePermissionsClose = () =>
    this.setState({ ...this.state, permissionsOpen: false });

  handleConfirmOpen = () => this.setState({ ...this.state, confirmOpen: true });
  handleConfirmClose = () =>
    this.setState({ ...this.state, confirmOpen: false });

  /**
   * Publication handler
   */
  handlePublish = (publishClick) => {
    return (event, formik) => {
      this.handleConfirmClose();
      this.handlePermissionsClose();

      // temporary solution (dispatch action to communicate with modal)
      // FIXME: In the future, change this to a more general solution
      geoGlobalStore.dispatch({
        type: ACTION_SAVE_KNOWLEDGE_ENABLE,
      });

      publishClick(event, formik);
    };
  };

  render() {
    const {
      formState,
      publishClick,
      numberOfFiles,
      errors,
      ...uiProps
    } = this.props;

    const action = i18next.t("publish");
    const capitalizedAction = action[0].toUpperCase() + action.slice(1);
    return (
      <>
        <ActionButton
          name="publish"
          onClick={this.handlePermissionsOpen}
          positive
          icon
          labelPosition="left"
          {...uiProps}
        >
          {(formik) => (
            <>
              {formik.isSubmitting && formState === FORM_PUBLISHING ? (
                <Icon size="large" loading name="spinner" />
              ) : (
                <Icon name="upload" />
              )}
              {capitalizedAction}
            </>
          )}
        </ActionButton>

        {!_isEmpty(errors) && (
          <Message
            error
            header="There was some errors with your submission"
            list={[
              "You must include both a upper and lower case letters in your password.",
              "You need to select your home country.",
            ]}
          />
        )}

        {this.state.permissionsOpen && (
          <Modal
            open={this.state.permissionsOpen}
            onClose={this.handlePermissionsClose}
            size="small"
            onMount={() => {
              const visibilityConfigCard = document.getElementsByClassName(
                "access-right"
              );

              if (visibilityConfigCard.length > 0) {
                visibilityConfigCard[0].className = "ui segment access-right";
              }
            }}
          >
            <Modal.Header>Defining visibility</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <section>
                  <p>
                    Before publishing your resource, please set the visibility
                    that should apply to it. You can change these definitions
                    after the publication.
                  </p>

                  <Grid>
                    <Grid.Row centered>
                      <Grid.Column width={10}>
                        <AccessRightField
                          label={i18next.t("")}
                          labelIcon={""}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </section>
              </Modal.Description>
            </Modal.Content>

            <Modal.Actions>
              <Button onClick={this.handlePermissionsClose} floated="left">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  this.handlePermissionsClose();
                  this.handleConfirmOpen();
                }}
                primary
              >
                Proceed <Icon name="right chevron" />
              </Button>
            </Modal.Actions>

            <Modal
              onClose={this.handleConfirmClose}
              onUnmount={this.handleConfirmClose}
              open={this.state.confirmOpen}
              size="small"
              centered={true}
            >
              <Modal.Header>Confirm publication</Modal.Header>
              <Modal.Content>
                <h3>Are you sure you want to publish this record?</h3>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handleConfirmClose} floated="left">
                  Cancel
                </Button>
                <ActionButton
                  positive
                  name="publish"
                  onClick={this.handlePublish(publishClick)}
                  content={capitalizedAction}
                />
              </Modal.Actions>
            </Modal>
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: state.deposit.formState,
  numberOfFiles: Object.values(state.files.entries).length,
  errors: state.deposit.errors,
});

const mapDispatchToProps = (dispatch) => ({
  publishClick: (event, formik) => {
    dispatch((dispatch, getState, config) => {
      dispatch({
        type: FORM_ACTION_EVENT_EMITTED,
        payload: FORM_PUBLISHING,
      });
      formik.handleSubmit(event);
    });
  },
});

export const CustomRDMPublishButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomRDMPublishButtonComponent);
