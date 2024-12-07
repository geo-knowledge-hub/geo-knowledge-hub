/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component, useState } from "react";
import { connect, Provider } from "react-redux";
import { withState } from "react-searchkit";

import _get from "lodash/get";
import _set from "lodash/set";
import _omit from "lodash/omit";
import _cloneDeep from "lodash/cloneDeep";

import { DateTime } from "luxon";
import { Formik } from "formik";

import {
  Table,
  Button,
  Grid,
  Icon,
  Popup,
  Card,
  Form,
  Item,
  Segment,
} from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { MetadataAccess, FilesAccess, EmbargoAccess } from "../access";
import { depositResourceSaveDraft } from "../../../../../../../state/operations/deposit";

import { ComponentMessageId } from "../messages";

/**
 * Embargo popup component.
 */
const EmbargoPopup = ({
  access,
  packageAccess,
  communityAccess,
  canBeEdited,
}) => {
  // States
  const [open, setOpen] = useState(false);

  // Auxiliary functions.
  const generateEmbargoDate = (access) => {
    const embargoUntil = access.embargo?.until;

    return embargoUntil
      ? DateTime.fromISO(embargoUntil).toLocaleString(DateTime.DATE_FULL)
      : "Not defined";
  };

  return (
    <Popup
      trigger={
        <Grid
          className={`popup-trigger ${canBeEdited ? "enabled" : "disabled"}`}
        >
          <Grid.Row fluid>
            <Grid.Column centered textAlign="center">
              {generateEmbargoDate(access)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      }
      flowing
      on="click"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disabled={!canBeEdited}
    >
      <div id={"deposit-form"}>
        <Card className="access-right">
          <Form.Field required>
            <Card.Content extra>
              <EmbargoAccess
                access={access}
                disabled={!canBeEdited}
                packageAccess={packageAccess}
                communityAccess={communityAccess}
              />
              <Grid>
                <Grid.Row fluid>
                  <Grid.Column centered textAlign={"center"}>
                    <Button
                      icon="save"
                      content="Save"
                      onClick={() => setOpen(false)}
                      basic
                      compact
                      disabled={!canBeEdited}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Form.Field>
        </Card>
      </div>
    </Popup>
  );
};

/**
 * Table row component to present the results
 * of the search.
 */
class TableRowItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordData: this.props.recordData,
    };
  }

  render() {
    // Props (Permission operation)
    const { recordData, canBeEdited } = this.props;

    // Props (Deposit operation)
    const {
      onSaveModification,
      stateDepositOperationMetadata,
      stateDepositOperationInProgress,
    } = this.props;

    // Props (Deposit config)
    const {
      stateDepositConfig,
      statePackageRecord,
      statePackageRecordCommunity,
    } = this.props;

    // Extracting the information to be used in the table
    const recordId = _get(recordData, "id");
    const title = _get(recordData, "metadata.title", i18next.t("No title"));
    const resourceType = _get(recordData, "ui.resource_type.title_l10n");

    const packageAccess = _get(statePackageRecord, "access.record");
    const communityAccess = _get(
      statePackageRecordCommunity,
      "access.visibility",
      "public",
    );

    const recordDataAccess = _omit(
      _get(recordData, "access", {
        embargo: { active: false },
      }),
      "status",
    );

    return (
      <Formik
        initialValues={{ access: recordDataAccess }}
        onSubmit={(values) => {
          // Preparing the record to be saved
          const recordObject = _cloneDeep(recordData);

          // Adding the edited object to the record data
          _set(recordObject, "access", values.access);

          onSaveModification(recordObject, {
            record: recordObject,
            componentId: ComponentMessageId,
          });
        }}
      >
        {({ handleSubmit, values }) => (
          <Table.Row>
            <Table.Cell>
              <Grid
                textAlign={"center"}
                verticalAlign={"middle"}
                className={"m-5"}
              >
                <Item>
                  <Item.Content>
                    <Segment basic compact>
                      {title}
                    </Segment>
                  </Item.Content>
                </Item>
              </Grid>
            </Table.Cell>

            <MetadataAccess
              recordAccess={values.access.record}
              packageAccess={packageAccess}
              communityAccess={communityAccess}
              disabled={!canBeEdited}
            />

            <FilesAccess
              access={values.access}
              packageAccess={packageAccess}
              communityAccess={communityAccess}
              disabled={!canBeEdited}
            />

            <Table.Cell>
              <EmbargoPopup
                access={values.access}
                packageAccess={packageAccess}
                communityAccess={communityAccess}
                canBeEdited={canBeEdited}
              />
            </Table.Cell>

            <Table.Cell textAlign="right">
              <Button
                basic
                icon
                compact
                color="green"
                floated="right"
                name="submit"
                type="submit"
                onClick={(event) => {
                  handleSubmit(event);
                }}
                disabled={!canBeEdited || !(packageAccess === "public")}
                loading={
                  stateDepositOperationInProgress &&
                  stateDepositOperationMetadata.record.id === recordData.id
                }
              >
                <Icon name={"save"} /> {i18next.t("Save")}
              </Button>
            </Table.Cell>
          </Table.Row>
        )}
      </Formik>
    );
  }
}

class ResultItemComponent extends Component {
  render() {
    // Props (Deposit store)
    const {
      statePackageRecord,
      stateDepositConfigResource,
      statePackageRecordCommunity,
      dispatchDepositResourceSaveDraft,
    } = this.props;

    // Props (Deposit operation)
    const { stateDepositOperationMetadata, stateDepositOperationInProgress } =
      this.props;

    // Props (Search operation)
    const { currentResultsState: results } = this.props;

    // Preparing the data
    if (
      stateDepositOperationMetadata?.record &&
      stateDepositOperationInProgress
    ) {
      const updatedRecords = results.data.hits.map((result) => {
        if (result.id === stateDepositOperationMetadata.record.id) {
          return stateDepositOperationMetadata.record;
        }

        return result;
      });

      _set(results, "data.hits", updatedRecords);
    }

    const resultContent = results?.data?.hits || [];
    const hasContentAvailable = resultContent.length > 0;

    return (
      <>
        {hasContentAvailable && (
          <Table unstackable>
            <Table.Header>
              <Table.Row textAlign="center">
                <Table.HeaderCell width={5}>Title</Table.HeaderCell>
                <Table.HeaderCell width={3}>Record visibility</Table.HeaderCell>
                <Table.HeaderCell width={3}>Files visibility</Table.HeaderCell>
                <Table.HeaderCell width={3}>Embargo</Table.HeaderCell>
                <Table.HeaderCell width={2}></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.data.hits.map((result) => {
                // Extracting records details about the package context
                const packageId = _get(statePackageRecord, "id", null);
                const packageParentId = _get(
                  statePackageRecord,
                  "parent.id",
                  null,
                );

                const recordPackageId = _get(
                  result,
                  "relationship.packages.0.id",
                  null,
                );
                const recordManagerId = _get(
                  result,
                  "parent.relationship.managed_by.id",
                  null,
                );

                const packageIsNotNull = packageId !== null;
                const packageParentIsNotNull = packageParentId !== null;
                const recordIsNotNull = recordPackageId !== null;
                const recordManagerIsNotNull = recordManagerId !== null;

                const canBeEdited =
                  packageIsNotNull &&
                  packageParentIsNotNull &&
                  recordIsNotNull &&
                  recordManagerIsNotNull &&
                  packageId === recordPackageId &&
                  packageParentId === recordManagerId;

                return (
                  <TableRowItem
                    key={result.id}
                    recordData={result}
                    canBeEdited={canBeEdited}
                    statePackageRecord={statePackageRecord}
                    stateDepositConfig={stateDepositConfigResource}
                    statePackageRecordCommunity={statePackageRecordCommunity}
                    stateDepositOperationMetadata={
                      stateDepositOperationMetadata
                    }
                    stateDepositOperationInProgress={
                      stateDepositOperationInProgress
                    }
                    onSaveModification={dispatchDepositResourceSaveDraft}
                  />
                );
              })}
            </Table.Body>
          </Table>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  statePackageRecord: state.storage.packageObject.record,
  statePackageRecordCommunity: state.storage.packageObject.community,
  stateDepositConfigResource: state.storage.depositConfig.resource.record,
  stateDepositOperationMetadata: state.deposit.depositOperationMetadata,
  stateDepositOperationInProgress: state.deposit.depositOperationInProgress,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchDepositResourceSaveDraft: (recordData, operationMetadata) =>
    dispatch(depositResourceSaveDraft(recordData, operationMetadata)),
});

export const ResultItem = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultItemComponent);

export const ResultItemHOC = (store) => {
  const Component = ({ ...args }) => (
    <Provider store={store}>
      <ResultItem {...args} />
    </Provider>
  );

  return withState(Component);
};
