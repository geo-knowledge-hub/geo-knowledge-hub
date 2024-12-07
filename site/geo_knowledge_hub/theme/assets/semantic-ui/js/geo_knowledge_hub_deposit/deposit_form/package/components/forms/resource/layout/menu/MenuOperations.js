/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { connect, Provider } from "react-redux";

import {
  Grid,
  List,
  Icon,
  Header,
  Button,
  Segment,
  Image,
  Popup,
} from "semantic-ui-react";

import { i18next } from "@translations/geo_knowledge_hub/i18next";

import { ConfirmationModal } from "../modal";

import { depositImportResources } from "../../../../../state/operations/deposit";
import { layoutResourcesOpenModalManagementPermissions } from "../../../../../state/operations/layout";

import { ComponentMessageId } from "../../messages";

class MenuOperationsComponent extends Component {
  state = {
    operationModalOpen: false,
    operationModalDescription: {},
  };

  checkIfIsDraftNewVersion() {
    // The "import version" operation only works when the record is a
    // draft version of an existing version. So, this method
    // validates if the component can be rendered.
    const { statePackageRecord } = this.props;

    return statePackageRecord.status === "new_version_draft";
  }

  /**
   * Open the operation modal.
   */
  openOperationModal() {
    this.setState({ ...this.state, operationModalOpen: true });
  }

  /**
   * Close the operation modal.
   */
  closeOperationModal() {
    this.setState({ ...this.state, operationModalOpen: false });
  }

  operationImportResources() {
    // Props (Deposit)
    const { statePackageRecord } = this.props;

    // Props (Operation)
    const { dispatchDepositImportResources } = this.props;

    const operationModalDescription = {
      title: i18next.t("Import resources"),
      content: i18next.t(
        "Would you like to import the resources from the previous package into this new version?",
      ),
      onAccept: (e) => {
        dispatchDepositImportResources(statePackageRecord, {
          operationId: "import-resource",
          componentId: ComponentMessageId,
        });

        this.closeOperationModal();
      },
      onRefuse: (e) => {
        this.closeOperationModal();
      },
      onClose: () => {
        this.closeOperationModal();
      },
    };

    this.setState({
      ...this.state,
      operationModalDescription,
      operationModalOpen: true,
    });
  }

  // Rendering!
  render() {
    // State (Deposit operation)
    const { stateDepositOperationMetadata } = this.props;

    // State (Operation modal)
    const { operationModalOpen, operationModalDescription } = this.state;

    // Defining rendering props
    const isDraftNewVersion = this.checkIfIsDraftNewVersion();

    return (
      <>
        <Segment>
          <Grid stackable>
            <Grid.Row className={"highlight-background"}>
              <Grid.Column>
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column verticalAlign={"middle"}>
                      <Header as={"h4"}>{i18next.t("Operations")}</Header>
                    </Grid.Column>
                    <Grid.Column verticalAlign="right">
                      <Icon name={"plus square"} size={"large"} />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={16}>
                <List divided verticalAlign="middle">
                  <List.Item>
                    <List.Content floated="right">
                      <Button
                        basic
                        compact
                        size="small"
                        onClick={() => {
                          this.operationImportResources();
                        }}
                        disabled={!isDraftNewVersion}
                        loading={
                          stateDepositOperationMetadata?.operation
                            ?.operationId === "import-resource"
                        }
                      >
                        Use
                      </Button>
                    </List.Content>
                    <Image avatar circular>
                      <Icon name="sync" />
                    </Image>
                    <List.Content>
                      <Popup
                        content={i18next.t(
                          "Operation used to import resources from a previous version of the package",
                        )}
                        trigger={<span>Import resources</span>}
                      />
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <ConfirmationModal
          open={operationModalOpen}
          {...operationModalDescription}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  statePackageRecord: state.storage.packageObject.record,
  stateDepositOperationMetadata: state.deposit.depositOperationMetadata,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLayoutResourcesOpenModalManagementPermissions: () =>
    dispatch(layoutResourcesOpenModalManagementPermissions()),
  dispatchDepositImportResources: (recordData, operationMetadata) =>
    dispatch(depositImportResources(recordData, operationMetadata)),
});

export const MenuOperations = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuOperationsComponent);

export const MenuOperationsHOC = (store) => {
  return ({ ...args }) => (
    <Provider store={store}>
      <MenuOperations {...args} />
    </Provider>
  );
};
