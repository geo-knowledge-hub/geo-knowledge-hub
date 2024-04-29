/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, Component } from "react";
import PropTypes from "prop-types";
import { connect, useStore, Provider } from "react-redux";

import _set from "lodash/set";
import _get from "lodash/get";
import _isNil from "lodash/isNil";
import _cloneDeep from "lodash/cloneDeep";
import _truncate from "lodash/truncate";

import {
  Button,
  Icon,
  Item,
  Label,
  Modal,
  Message,
  Dropdown,
  Menu,
} from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { SearchItemCreators } from "@invenio-app-rdm/utils";

import {
  extractRecordBadge,
  extractProgrammeActivityAcronym,
  recordTypeLinksFactory,
} from "../../../../../../../../utils";

import {
  depositResourcesDetach,
  depositResourcesEdit,
  depositResourcesNewVersion,
  depositResourcesDelete,
} from "../../../../../state/operations/deposit";

import { ComponentMessageId } from "../../messages";
import { ConfirmationModal } from "../modal";

const RECORD_STATUS = {
  in_review: { color: "warning", title: i18next.t("In review") },
  declined: { color: "negative", title: i18next.t("Declined") },
  expired: { color: "expired", title: i18next.t("Expired") },
  draft_with_review: { color: "neutral", title: i18next.t("Draft") },
  draft: { color: "neutral", title: i18next.t("Draft") },
  new_version_draft: {
    color: "neutral",
    title: i18next.t("New version draft"),
  },
};

class ResultsListItemComponent extends Component {
  state = {
    confirmationModalOpen: false,
    confirmationModalDefinitions: {},
  };

  /**
   * Open the confirmation modal.
   */
  openConfirmationModal(modalDefinition, callback) {
    this.setState(
      {
        ...this.state,
        confirmationModalOpen: true,
        confirmationModalDefinitions: modalDefinition,
      },
      callback
    );
  }

  /**
   * Close the confirmation modal.
   */
  closeConfirmationModal(callback) {
    this.setState(
      {
        ...this.state,
        confirmationModalOpen: false,
        confirmationModalDefinitions: {},
      },
      callback
    );
  }

  /**
   * Operation method to edit an existing record.
   */
  operationEditRecord() {
    // Props (Result)
    const { result: record } = this.props;

    // Props (Deposit store)
    const { stateDepositConfigResource, dispatchDepositResourcesEdit } =
      this.props;

    // Preparing the configuration to edit the record
    const depositConfig = _cloneDeep(stateDepositConfigResource);

    // Checking if is a draft
    const isDraft = record.status === "draft";

    // ToDo: Should we move this to the redux reducer/operation ?
    if (isDraft) {
      _set(depositConfig, "apiUrl", record.links.self);
    } else {
      _set(depositConfig, "apiUrl", record.links.draft);
    }

    dispatchDepositResourcesEdit(
      {
        record,
        config: depositConfig,
      },
      {
        record,
        menuLoading: true,
        componentId: ComponentMessageId,
      }
    );
  }

  /**
   * Operation method to exclude an existing draft record.
   */
  operationExcludeDraftRecord() {
    // Props (Result)
    const { result: record } = this.props;

    // Props (Deposit store)
    const { stateDepositConfigResource, dispatchDepositResourcesDelete } =
      this.props;

    // Preparing the configuration to edit the record
    const depositConfig = _cloneDeep(stateDepositConfigResource);

    // Checking if is a draft
    const isDraft = record.status === "draft";

    // ToDo: Should we move this to the redux reducer/operation ?
    if (isDraft) {
      _set(depositConfig, "apiUrl", record.links.self);
    } else {
      return null; // nothing to do! This is not acceptable by the API.
    }

    dispatchDepositResourcesDelete(
      {
        record,
        config: depositConfig,
      },
      {
        record,
        menuLoading: true,
        componentId: ComponentMessageId,
      }
    );
  }

  /**
   * Operation method to create a new record version.
   */
  operationNewRecordVersion() {
    // Props (Result)
    const { result: record } = this.props;

    // Props (Deposit store)
    const { stateDepositConfigResource } = this.props;

    // Props (Deposit operation)
    const { dispatchDepositResourcesNewVersion } = this.props;

    dispatchDepositResourcesNewVersion(
      {
        record,
        config: stateDepositConfigResource,
      },
      {
        record,
        menuLoading: true,
        componentId: ComponentMessageId,
      }
    );
  }

  /**
   * Operation method to detach a resource from the package.
   */
  operationDetachRecord() {
    // Props (Result)
    const { result: record } = this.props;

    // Props (Deposit operation)
    const { dispatchDepositResourcesDetach } = this.props;

    dispatchDepositResourcesDetach(
      {
        record,
      },
      {
        record,
        menuLoading: true,
        componentId: ComponentMessageId,
      }
    );
  }

  /**
   * Operation method to preview a resource.
   */
  operationViewRecord(previewMode) {
    // Props (Result)
    const { result: record } = this.props;

    // Props (Deposit store)
    const { statePackageRecord } = this.props;

    // Preparing package information
    const packagePid = _get(statePackageRecord, "id");

    // Preparing link
    let recordUrl = null;
    let viewRecordUrl = null;

    if (previewMode) {
      recordUrl = _get(record, "links.record_html");
      viewRecordUrl = `${recordUrl}?preview=1&package=${packagePid}`;
    } else {
      recordUrl = _get(record, "links.self_html");
      viewRecordUrl = `${recordUrl}?package=${packagePid}`;
    }

    if (!_isNil(recordUrl)) {
      // window.location = viewRecordUrl;
      window.open(viewRecordUrl, "_blank");
    }
  }

  render() {
    // State (Confirmation modal)
    const { confirmationModalOpen, confirmationModalDefinitions } = this.state;

    // Props (Search Result)
    const { result, index } = this.props;

    // Props (Deposit store)
    const { statePackageRecord } = this.props;

    // State (Deposit operation)
    const { stateDepositOperationMetadata, stateDepositOperationInProgress } =
      this.props;

    // Extracting information to render the result.
    const recordBadge = extractRecordBadge(result.parent.type);
    const recordLinks = recordTypeLinksFactory(result.id, result.parent.type);

    const accessStatusId = _get(result, "ui.access_status.id", "open");
    const accessStatus = _get(result, "ui.access_status.title_l10n", "Open");
    const accessStatusIcon = _get(result, "ui.access_status.icon", "unlock");

    const createdDate = _get(
      result,
      "ui.created_date_l10n_long",
      i18next.t("No creation date found.")
    );

    const creators = _get(result, "ui.creators.creators", []).slice(0, 3);

    const descriptionStripped = _get(
      result,
      "ui.description_stripped",
      i18next.t("No description")
    );

    const publicationDate = _get(
      result,
      "ui.publication_date_l10n_long",
      i18next.t("No publication date found.")
    );
    const resourceType = _get(
      result,
      "ui.resource_type.title_l10n",
      i18next.t("No resource type")
    );

    const title = _get(result, "metadata.title", i18next.t("No title"));
    const subjects = _get(result, "ui.subjects", []);
    const version = _get(result, "ui.version", null);
    const isPublished = result.is_published;

    const programmeActivityAcronym = extractProgrammeActivityAcronym(
      _get(result, "metadata.geo_work_programme_activity.title.en")
    );

    const viewLink = isPublished
      ? recordLinks.published.ui
      : recordLinks.draft.ui;

    // Validating the type of relation between package and resource.
    // This is done to enable us to define in the interface the correct
    // options.
    const packageParent = statePackageRecord.parent.id;
    const resourceManager = result.parent?.relationship?.managed_by?.id;

    const resourceCanBeModified = resourceManager === packageParent;
    const isPackagePublished = statePackageRecord?.is_published;

    // Defining the status of the record
    const isDraft = result.status === "draft";

    // Auxiliary components
    let isDropdownLoading =
      stateDepositOperationMetadata?.record?.id === result.id &&
      stateDepositOperationMetadata?.menuLoading;

    isDropdownLoading = stateDepositOperationInProgress && isDropdownLoading;

    let buttonOptions = null;
    let buttonDetach = null;
    let buttonEditDraft = null;
    let buttonNewVersion = null;
    let buttonDelete = null;
    let buttonPermissions = null;
    let buttonView = null;

    if (resourceCanBeModified) {
      buttonEditDraft = (
        <Dropdown.Item
          icon="edit"
          text={i18next.t("Edit metadata")}
          onClick={() => {
            this.operationEditRecord();
          }}
        />
      );

      if (isDraft) {
        buttonView = (
          <Dropdown.Item
            icon="eye"
            text={i18next.t("Preview")}
            onClick={() => {
              this.operationViewRecord(true);
            }}
          />
        );
      } else {
        buttonView = (
          <Dropdown.Item
            icon="eye"
            text={i18next.t("View")}
            onClick={() => {
              this.operationViewRecord(false);
            }}
          />
        );
      }

      if (!isDraft && !isPackagePublished) {
        buttonNewVersion = (
          <Dropdown.Item
            icon="code branch"
            text={i18next.t("New version")}
            onClick={() => {
              this.openConfirmationModal({
                title: i18next.t("New resource version"),
                content: i18next.t(
                  "Are you sure you want to create a new version for this resource ?"
                ),
                onAccept: (e) => {
                  this.closeConfirmationModal(() => {
                    this.operationNewRecordVersion();
                  });
                },
                onRefuse: (e) => {
                  this.closeConfirmationModal();
                },
                onClose: (e) => {
                  this.closeConfirmationModal();
                },
              });
            }}
          />
        );
      }

      if (isDraft && !isPackagePublished) {
        buttonDelete = (
          <Dropdown.Item
            icon="delete"
            text={i18next.t("Exclude")}
            onClick={() => {
              this.openConfirmationModal({
                title: i18next.t("Resource exclusion"),
                content: i18next.t(
                  "Are you sure you want to exclude this resource ? This action cannot be undone."
                ),
                onAccept: (e) => {
                  this.closeConfirmationModal(() => {
                    this.operationExcludeDraftRecord();
                  });
                },
                onRefuse: (e) => {
                  this.closeConfirmationModal();
                },
                onClose: (e) => {
                  this.closeConfirmationModal();
                },
              });
            }}
          />
        );
      }

      // buttonPermissions = (
      //   <Dropdown.Item icon="key" text={i18next.t("Change permissions")} />
      // );
    }

    if (!isPackagePublished) {
      buttonDetach = (
        <Dropdown.Item
          onClick={() => {
            this.openConfirmationModal({
              title: i18next.t("Detach the selected resource from the package"),
              content: i18next.t(
                "Are you sure you want to detach this resource from the package ?"
              ),
              onAccept: (e) => {
                this.closeConfirmationModal(() => {
                  this.operationDetachRecord();
                });
              },
              onRefuse: (e) => {
                this.closeConfirmationModal();
              },
              onClose: (e) => {
                this.closeConfirmationModal();
              },
            });
          }}
        >
          <Icon name="unlinkify" />
          Detach
        </Dropdown.Item>
      );
    }

    buttonOptions = (
      <div className="right floated">
        <Dropdown
          item
          simple
          floating
          icon={<></>}
          trigger={
            <Button size={"small"} compact loading={isDropdownLoading}>
              <Icon name="wrench" />
              {i18next.t("Options")}
            </Button>
          }
        >
          <Dropdown.Menu>
            {resourceCanBeModified && (
              <>
                {buttonView}
                {React.isValidElement(buttonView) && <Dropdown.Divider />}
                {buttonEditDraft}
                {buttonNewVersion}
                {/*<Dropdown.Divider />*/}
                {/*{buttonPermissions}*/}
                {React.isValidElement(buttonDetach) && <Dropdown.Divider />}
              </>
            )}

            {buttonDetach}
            {buttonDelete}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );

    return (
      <>
        <Item key={index} className="deposits-list-item mb-20">
          <div className="status-icon mr-10">
            <Item.Content verticalAlign="top">
              <Item.Extra>
                {isPublished ? (
                  <Icon name="check" className="positive" />
                ) : (
                  <Icon name="upload" className="negative" />
                )}
              </Item.Extra>
            </Item.Content>
          </div>
          <Item.Content style={{ cursor: "default" }}>
            <Item.Extra className="labels-actions">
              <Label size="tiny" color={recordBadge.color}>
                <i className={`icon ${recordBadge.icon}`}></i>
                {recordBadge.name}
              </Label>
              <Label size="tiny" color={"gray"}>
                {publicationDate} ({version})
              </Label>
              <Label size="tiny" color={"gray"}>
                {resourceType}
              </Label>
              {programmeActivityAcronym && (
                <Label size="tiny" color={"gray"}>
                  {programmeActivityAcronym}
                </Label>
              )}
              {result.status in RECORD_STATUS && result.status !== "published" && (
                <Label size="tiny" className={RECORD_STATUS[result.status].color}>
                  {RECORD_STATUS[result.status].title}
                </Label>
              )}
              {accessStatusId === "restricted" && (
                <Label size="tiny" className={`access-status ${accessStatusId}`}>
                  {accessStatusIcon && <i className={`icon ${accessStatusIcon}`} />}
                  {accessStatus}
                </Label>
              )}
              {buttonOptions}
            </Item.Extra>
            <Item.Header as="h2">
              <a href={viewLink}>{title}</a>
            </Item.Header>
            <Item.Meta>
              <div className="creatibutors">
                <SearchItemCreators creators={creators} />
              </div>
            </Item.Meta>
            <Item.Description>
              {_truncate(descriptionStripped, {
                length: 350,
              })}
            </Item.Description>
            <Item.Extra>
              {subjects.map((subject) => (
                <Label key={subject.title_l10n} size="tiny">
                  {subject.title_l10n}
                </Label>
              ))}
              {createdDate && (
                <div>
                  <small>
                    {i18next.t("Uploaded on")} <span>{createdDate}</span>
                  </small>
                </div>
              )}
            </Item.Extra>
          </Item.Content>
        </Item>

        <ConfirmationModal
          open={confirmationModalOpen}
          {...confirmationModalDefinitions}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  statePackageRecord: state.storage.packageObject.record,
  stateDepositConfigResource: state.storage.depositConfig.resource.record,
  stateDepositOperationMetadata: state.deposit.depositOperationMetadata,
  stateDepositOperationInProgress: state.deposit.depositOperationInProgress,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchDepositResourcesEdit: (recordData, operationMetadata) =>
    dispatch(depositResourcesEdit(recordData, operationMetadata)),
  dispatchDepositResourcesDetach: (recordData, operationMetadata) =>
    dispatch(depositResourcesDetach(recordData, operationMetadata)),
  dispatchDepositResourcesNewVersion: (recordData, operationMetadata) =>
    dispatch(depositResourcesNewVersion(recordData, operationMetadata)),
  dispatchDepositResourcesDelete: (recordData, operationMetadata) =>
    dispatch(depositResourcesDelete(recordData, operationMetadata)),
});

export const ResultsListItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsListItemComponent);

export const ResultsListItemHOC = (store) => {
  return ({ ...args }) => (
    <Provider store={store}>
      <ResultsListItem {...args} />
    </Provider>
  );
};
