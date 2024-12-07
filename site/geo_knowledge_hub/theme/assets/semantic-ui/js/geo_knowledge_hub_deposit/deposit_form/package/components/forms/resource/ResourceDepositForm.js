/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { connect, useStore } from "react-redux";

import { Container, Grid } from "semantic-ui-react";

import {
  RDMCountComponent,
  RDMToggleComponent,
  RDMRecordSearchBarElement,
} from "@invenio-app-rdm/search/components";

import { SearchApp } from "@js/invenio_search_ui/components";
import { DashboardResultView } from "@invenio-app-rdm/user_dashboard/base";

import {
  depositDiscardTemporaryResource,
  depositResourcesAttach,
  depositResourceAssociateAndAttachDraft,
} from "../../../state/operations/deposit";

import {
  layoutResourcesCloseModal,
  layoutResourcesCloseModalSearch,
  layoutResourcesCloseModalManagementPermissions,
} from "../../../state/operations/layout";

import {
  DepositMessage,
  ResourceModal,
  ResourceSearchModal,
  ResourcePermissionManagementModal,
  EmptyResultsElement,
  ResultsListItemHOC,
  SearchLayoutHOC,
  updateReactSearchKitStore,
} from "./layout";

import {
  storageCleanResourceTemporaryData,
  storageSaveResourceTemporaryData,
} from "../../../state/operations/storage";

import { ComponentMessageId } from "./messages";

export const ResourcesDepositFormComponent = ({ ...props }) => {
  // States
  const reduxStore = useStore();

  // Auxiliary functions
  const overwriteSearchLayoutComponents = (store, formActivator) => {
    updateReactSearchKitStore({
      "Count.element": RDMCountComponent,
      "EmptyResults.element": EmptyResultsElement,
      "ResultsList.item": ResultsListItemHOC(store),
      "SearchApp.layout": SearchLayoutHOC(store, formActivator),
      "SearchApp.results": DashboardResultView,
      "SearchBar.element": RDMRecordSearchBarElement,
      "SearchFilters.Toggle.element": RDMToggleComponent,
    });
  };

  // Props (Resource layout)
  const { formActivator, stateDepositConfigResourceSearch } = props;

  // Props (Resource form)
  const {
    stateResourceModalOpen,
    stateResourceModalData,
    stateResourcePermissionsData,
    dispatchLayoutResourcesCloseModal,
  } = props;

  // Props (Resource Search modal)
  const { stateResourceSearchModalOpen, stateResourceSearchModalData } = props;

  // Props (Resource Management Permission modal)
  const { stateResourceManagementPermissionOpen } = props;

  // Props (Deposit operation)
  const {
    statePackageRecord,
    dispatchDepositResourcesAttach,
    dispatchDepositResourceAssociateAndAttachDraft,
    dispatchLayoutResourcesCloseModalSearch,
    dispatchLayoutResourcesCloseModalManagementPermissions,
    dispatchDepositDiscardTemporaryResource,
    stateDepositOperationMessage,
    dispatchStorageSaveResourceTemporaryData,
    dispatchStorageCleanResourceTemporaryData,
  } = props;

  // Props (Deposit config)
  const { stateDepositConfig } = props;

  // Configuring search layout
  overwriteSearchLayoutComponents(reduxStore, formActivator);

  // Rendering!
  return (
    <Container className="rel-mt-2">
      <div>
        <Grid className="mt-9" centered>
          {stateDepositOperationMessage?.componentId === ComponentMessageId && (
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={16}>
                <DepositMessage componentId={ComponentMessageId} />
              </Grid.Column>
            </Grid.Row>
          )}

          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={16}>
              <SearchApp config={stateDepositConfigResourceSearch} />

              <ResourceModal
                depositConfig={stateDepositConfig}
                modalPackageRecord={statePackageRecord}
                modalOpen={stateResourceModalOpen}
                modalData={stateResourceModalData}
                modalResourcesPermissions={stateResourcePermissionsData}
                modalOnClose={() => {
                  dispatchLayoutResourcesCloseModal();
                  dispatchDepositDiscardTemporaryResource();
                }}
                depositOnFinish={(recordData, operationMetadata) => {
                  dispatchDepositResourceAssociateAndAttachDraft(
                    recordData,
                    operationMetadata,
                  );
                  dispatchStorageCleanResourceTemporaryData();
                }}
                depositOnDelete={() => {
                  dispatchLayoutResourcesCloseModal();
                }}
                depositOnSaveDraft={(recordData) => {
                  dispatchStorageSaveResourceTemporaryData(recordData);
                }}
              />

              <ResourceSearchModal
                defaultSearchApiName={"resources"} // all resources
                modalOpen={stateResourceSearchModalOpen}
                modalData={stateResourceSearchModalData}
                modalOnClose={() => {
                  dispatchLayoutResourcesCloseModalSearch();
                }}
                serializeResources={(resource) => {
                  return {
                    id: resource.id,
                    title: resource.metadata.title,
                  };
                }}
                searchApiDefinitions={{
                  resources: "/api/records",
                  package: statePackageRecord
                    ? statePackageRecord.links.context_resources
                    : null,
                }}
                onResourceSelection={(resource, operationMetadata) => {
                  dispatchDepositResourcesAttach(resource, operationMetadata);
                }}
              />

              <ResourcePermissionManagementModal
                modalPackageRecord={statePackageRecord}
                modalOpen={stateResourceManagementPermissionOpen}
                modalOnClose={() => {
                  dispatchLayoutResourcesCloseModalManagementPermissions();
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Container>
  );
};

const mapDispatchToProps = (dispatch) => ({
  // Deposit operation: Attaching
  dispatchDepositResourcesAttach: (recordData, operationMetadata) =>
    dispatch(depositResourcesAttach(recordData, operationMetadata)),
  // Deposit operation: Delete unfinished draft
  dispatchDepositDiscardTemporaryResource: () =>
    dispatch(depositDiscardTemporaryResource()),
  // Storage operation: Save temporary draft
  dispatchStorageSaveResourceTemporaryData: (recordData) =>
    dispatch(storageSaveResourceTemporaryData(recordData)),
  dispatchStorageCleanResourceTemporaryData: () =>
    dispatch(storageCleanResourceTemporaryData()),
  // Deposit operation: Association and attachment between package and resources
  dispatchDepositResourceAssociateAndAttachDraft: (
    recordData,
    operationMetadata,
  ) =>
    dispatch(
      depositResourceAssociateAndAttachDraft(recordData, operationMetadata),
    ),
  // Deposit operation: Modal layout to create/edit resources
  dispatchLayoutResourcesCloseModal: (modalData) =>
    dispatch(layoutResourcesCloseModal(modalData)),
  // Deposit operation: Modal layout to attach existing resources to the package.
  dispatchLayoutResourcesCloseModalSearch: () =>
    dispatch(layoutResourcesCloseModalSearch()),
  // Deposit operation: Modal layout to manage resources permissions.
  dispatchLayoutResourcesCloseModalManagementPermissions: () =>
    dispatch(layoutResourcesCloseModalManagementPermissions()),
});

const mapStateToProps = (state) => ({
  // Storage
  stateDepositConfig: state.storage.depositConfig,
  statePackageRecord: state.storage.packageObject.record,
  stateDepositConfigResourceSearch: state.storage.depositConfig.resource.search,
  // Deposit operation: Modal Layout to create/edit resources.
  stateResourceModalOpen: state.layoutResources.resourceModalOpen,
  stateResourceModalData: state.layoutResources.resourceModalData,
  stateResourcePermissionsData: state.storage.resourcesObject.permissions,
  // Layout (Search Resource)
  stateResourceSearchModalOpen: state.layoutResources.resourceSearchModalOpen,
  stateResourceSearchModalData: state.layoutResources.resourceSearchModalData,
  // Layout (Permission management)
  stateResourceManagementPermissionOpen:
    state.layoutResources.resourceManagementPermissionOpen,
  // Deposit
  stateDepositOperationMessage: state.deposit.depositOperationMessage,
});

export const ResourceDepositForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResourcesDepositFormComponent);
