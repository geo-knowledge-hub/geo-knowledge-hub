/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, Component, Fragment } from "react";

import natsort from "natsort";

import _get from "lodash/get";
import _isNil from "lodash/isNil";
import _groupBy from "lodash/groupBy";
import _compact from "lodash/compact";
import _upperFirst from "lodash/upperFirst";

import {
  Grid,
  Tab,
  Modal,
  Segment,
  Menu,
  Icon,
  Dropdown,
  Button,
} from "semantic-ui-react";

import {
  AccessRightFieldResource,
  CreatibutorsField,
  DatesField,
  DepositFormApp,
  DescriptionsField,
  FileUploader,
  FormFeedback,
  IdentifiersField,
  LanguagesField,
  LicenseField,
  PIDField,
  PublicationDateField,
  PublisherField,
  RelatedWorksField,
  ResourceTypeField,
  SubjectsField,
  TitlesField,
  VersionField,
  FundingField,
  DeleteButton,
  SaveButtonResource,
  connect,
} from "@geo-knowledge-hub/geo-deposit-react";

import {
  TargetAudienceField,
  EngagementPriorityField,
  WorkProgrammeActivityField,
} from "@geo-knowledge-hub/geo-components-react";

import { LocationsField } from "@geo-knowledge-hub/invenio-geographic-components-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { OperationTypes } from "../../operations";

import { ConfirmationModal } from "../../../../../../base/ConfirmationModal";

/**
 * (Base component) Draft Controller Component.
 *
 * (Initial approach)
 */
class DraftControllerComponent extends Component {
  render() {
    // Props (Deposit)
    const { deposit, shouldUpdate } = this.props;
    const { record } = deposit;

    // Props (Layout operation)
    const { onDepositSaveDraft } = this.props;

    // Processing!
    if (shouldUpdate) {
      onDepositSaveDraft(record);
    }

    return <></>;
  }
}

/**
 * Draft Controller Component.
 */
const DraftController = connect(DraftControllerComponent);

/**
 * (Base component) Step Controller Component.
 *
 * (Initial approach)
 */
class StepControllerComponent extends Component {
  constructor(props) {
    super(props);

    this.handleStep = props.handleStep;
    this.handleMenuActiveWindow = props.handleMenuActiveWindow;

    // Actions where the `StepController` must act.
    this.validActions = [
      "DRAFT_SAVE_STARTED",
      "DRAFT_SAVE_FAILED",
      "DRAFT_HAS_VALIDATION_ERRORS",
    ];
  }

  render() {
    const { shouldUpdate } = this.props;

    if (shouldUpdate) {
      if (this.validActions.includes(this.props.deposit.actionState)) {
        this.handleStep(0, "metadata");
      }
    }

    return <></>;
  }
}

/**
 * Step Controller Component.
 */
const StepController = connect(StepControllerComponent);

/**
 * Modal refresher component.
 *
 * (Initial approach)
 */
const FormRefresherComponent = ({
  deposit,
  onFinishDeposit,
  onDepositDelete,
  resourceType,
  shouldUpdate,
  reportOperationStatus,
}) => {
  const { actionState, record } = deposit;

  if (shouldUpdate) {
    if (actionState === "DRAFT_SAVE_SUCCEEDED") {
      setTimeout(() => {
        onFinishDeposit(record, {
          type: OperationTypes.MENU_FACET_TYPE_OPERATION_TYPE,
          id: resourceType,
        });
      }, 500);

      reportOperationStatus(true);
    }

    if (actionState === "DRAFT_DELETE_STARTED") {
      setTimeout(() => {
        onDepositDelete();
      }, 500);

      reportOperationStatus(true);
    }
  }

  return <></>;
};

const FormRefresher = connect(FormRefresherComponent);

/**
 * (Base component) Resource Modal Content Component.
 */
export class ResourceModalContent extends Component {
  constructor(props) {
    super(props);

    const { files, record, resourceType } = this.props;

    this.config = props.config || {};
    this.config["canHaveMetadataOnlyRecords"] = true;

    // Processing vocabularies
    this.vocabularies = {
      metadata: {
        ...this.config.vocabularies,

        creators: {
          ...this.config.vocabularies.creators,
          type: [
            { text: "Person", value: "personal" },
            { text: "Organization", value: "organizational" },
          ],
        },

        contributors: {
          ...this.config.vocabularies.contributors,
          type: [
            { text: "Person", value: "personal" },
            { text: "Organization", value: "organizational" },
          ],
        },
        identifiers: {
          ...this.config.vocabularies.identifiers,
        },
      },
    };

    this.resourceTypeAvailable =
      this.vocabularies?.metadata?.resource_type || [];

    // Grouping and sorting
    this.resourceTypeGroupped = _groupBy(
      this.resourceTypeAvailable,
      "basetype"
    );

    this.resourceTypeGroups = Object.keys(this.resourceTypeGroupped).sort(
      (a, b) => natsort({ insensitive: true })(a, b)
    );

    // Processing resource types
    this.resourceBaseTypeSelected = null;

    if (resourceType && !_isNil(resourceType)) {
      this.resourceBaseTypeSelected = resourceType.baseType;
    }

    // Check if files are present
    this.noFiles = false;
    if (
      !Array.isArray(files.entries) ||
      (!files.entries.length && record.is_published)
    ) {
      this.noFiles = true;
    }

    // States
    this.state = {
      stepActive: 0,
      menuActive: "metadata",
      resourceBaseTypeSelected: this.resourceBaseTypeSelected,
      resourceTypeSelected: [],
      confirmationModalDefinitions: {},
      dataSentToStore: false, // flag to avoid multiple modifications in the store.
    };

    // Metadata panel
    this.metadataPaneMaxSteps = 8;

    // Menu panel
    this.menuPanes = {
      metadata: {
        title: i18next.t("Metadata"),
        id: "metadata",
        icon: "pencil alternate",
      },

      files: {
        id: "files",
        title: i18next.t("Files"),
        icon: "file",
      },

      permissions: {
        id: "permissions",
        title: i18next.t("Permissions"),
        icon: "key",
      },
    };
  }

  /**
   * Handle metadata form steps.
   * @param {int} step Number of the new step.
   */
  handleMetadataStep = async (step) => {
    if (step <= this.metadataPaneMaxSteps && step >= 0) {
      await this.setState({ ...this.state, stepActive: step });
    }
  };

  /**
   * Handle menu steps.
   */
  handleMenuStep = async (menuName) => {
    const isValid = Object.keys(this.menuPanes).includes(menuName);

    if (isValid) {
      await this.setState({ ...this.state, menuActive: menuName });
    }
  };

  /**
   * Handle menu and metadata form steps.
   */
  handleMenuAndMetadataSteps = async (step, menuStep) => {
    await this.handleMetadataStep(step);
    await this.handleMenuStep(menuStep);
  };

  /**
   * Handle the modification on the Tab.
   */
  stepChangeHandler = async (e, { activeIndex }) => {
    await this.handleMetadataStep(activeIndex);
  };

  /**
   * Update the confirmation modal definitions.
   */
  updateConfirmationModalDefinitions = async (definitions) => {
    await this.setState({
      ...this.state,
      confirmationModalDefinitions: definitions,
    });
  };

  /**
   * Filter resource types.
   */
  filterResourceTypes = async (baseType) => {
    let selectedResourceTypeData = [];
    const isResourceTypeValid = Object.keys(this.resourceTypeGroupped).includes(
      baseType
    );

    selectedResourceTypeData = this.resourceTypeGroupped[baseType];

    if (baseType === null || !isResourceTypeValid) {
      selectedResourceTypeData = this.resourceTypeAvailable;
    } else {
    }

    await this.setState({
      ...this.state,
      resourceTypeSelected: selectedResourceTypeData,
      resourceBaseTypeSelected: baseType,
    });
  };

  dataSentToStoreHandler = async () => {
    await this.setState({ ...this.state, dataSentToStore: true });
  };

  render() {
    // Props (Deposit)
    const {
      record,
      files,
      permissions,
      onFinishDeposit,
      onDepositDelete,
      onDepositSaveDraft,
      modalPackageRecord,
    } = this.props;

    // Props (Step operation)
    const {
      stepActive,
      menuActive,
      resourceTypeSelected,
      resourceBaseTypeSelected,
      confirmationModalDefinitions,
      dataSentToStore,
    } = this.state;

    // Auxiliary Components
    const panes = [
      {
        menuItem: i18next.t("1. Basic information"),
        render: () => (
          <Tab.Pane>
            <FormFeedback fieldPath="message" />
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <TitlesField
                    options={this.vocabularies.metadata.titles}
                    recordUI={record.ui}
                    required
                  ></TitlesField>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row verticalAlign={"bottom"}>
                <Grid.Column width={14}>
                  <ResourceTypeField
                    options={resourceTypeSelected}
                    required
                    optimized={false}
                  />
                </Grid.Column>
                <Grid.Column width={2} textAlign={"right"}>
                  <Dropdown
                    text={null}
                    icon={<></>}
                    trigger={
                      <Button fluid basic size={"medium"} type={"button"}>
                        <Icon name="filter" size={"small"} />{" "}
                        {i18next.t("Filter")}
                      </Button>
                    }
                  >
                    <Dropdown.Menu>
                      <Dropdown.Header
                        icon="tags"
                        content="Filter resource types"
                      />
                      <Dropdown.Item
                        selected={resourceBaseTypeSelected === null}
                        onClick={async () => {
                          await this.filterResourceTypes(null);
                        }}
                      >
                        All types
                      </Dropdown.Item>

                      {this.resourceTypeGroups.map((resourceTypeItem) => {
                        const resourceTypeName = _upperFirst(resourceTypeItem);

                        const resourceTypeIsSelected =
                          resourceTypeItem === resourceBaseTypeSelected;

                        return (
                          <Dropdown.Item
                            selected={resourceTypeIsSelected}
                            onClick={async () => {
                              await this.filterResourceTypes(resourceTypeItem);
                            }}
                          >
                            {resourceTypeName}
                            {resourceTypeIsSelected &&
                              ` (${i18next.t("Selected")})`}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row centered>
                <Grid.Column width={16}>
                  <Grid divided>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <PublicationDateField required />
                      </Grid.Column>

                      <Grid.Column width={8}>
                        {this.config.pids.map((pid) => (
                          <Fragment key={pid.scheme}>
                            <PIDField
                              btnLabelDiscardPID={pid.btn_label_discard_pid}
                              btnLabelGetPID={pid.btn_label_get_pid}
                              canBeManaged={pid.can_be_managed}
                              canBeUnmanaged={pid.can_be_unmanaged}
                              fieldPath={`pids.${pid.scheme}`}
                              fieldLabel={pid.field_label}
                              isEditingPublishedRecord={
                                record.is_published === true // is_published is `null` at first upload
                              }
                              managedHelpText={pid.managed_help_text}
                              pidLabel={pid.pid_label}
                              pidPlaceholder={pid.pid_placeholder}
                              pidType={pid.scheme}
                              unmanagedHelpText={pid.unmanaged_help_text}
                              required
                            />
                          </Fragment>
                        ))}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("2. Description and languages"),
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <LanguagesField
                    initialOptions={_get(record, "ui.languages", []).filter(
                      (lang) => lang !== null
                    )} // needed because dumped empty record from backend gives [null]
                    serializeSuggestions={(suggestions) =>
                      suggestions.map((item) => ({
                        text: item.title_l10n,
                        value: item.id,
                        key: item.id,
                      }))
                    }
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row centered>
                <Grid.Column width={16}>
                  <DescriptionsField
                    options={this.vocabularies.metadata.descriptions}
                    recordUI={_get(record, "ui", null)}
                    editorConfig={{
                      removePlugins: [
                        "Image",
                        "ImageCaption",
                        "ImageStyle",
                        "ImageToolbar",
                        "ImageUpload",
                        "MediaEmbed",
                        "Table",
                        "TableToolbar",
                        "TableProperties",
                        "TableCellProperties",
                      ],
                    }}
                  ></DescriptionsField>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("3. People"),
        render: () => (
          <Tab.Pane>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <CreatibutorsField
                    label={i18next.t("Creators")}
                    labelIcon="user"
                    fieldPath="metadata.creators"
                    roleOptions={this.vocabularies.metadata.creators.role}
                    schema="creators"
                    autocompleteNames={this.config.autocomplete_names}
                    required
                  />
                </Grid.Column>

                <Grid.Column>
                  <CreatibutorsField
                    addButtonLabel={i18next.t("Add contributor")}
                    label={i18next.t("Contributors")}
                    labelIcon="user plus"
                    fieldPath="metadata.contributors"
                    roleOptions={this.vocabularies.metadata.contributors.role}
                    schema="contributors"
                    autocompleteNames={this.config.autocomplete_names}
                    modal={{
                      addLabel: "Add contributor",
                      editLabel: "Edit contributor",
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("4. Initiatives, audience, and subjects"),
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <SubjectsField
                    initialOptions={_get(record, "ui.subjects", null)}
                    limitToOptions={
                      this.vocabularies.metadata.subjects.limit_to
                    }
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={16}>
                  <WorkProgrammeActivityField
                    required={false}
                    initialSuggestions={
                      _compact([
                        _get(record, "ui.geo_work_programme_activity", null),
                      ]) || null
                    }
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <EngagementPriorityField
                    required={false}
                    initialSuggestions={_get(
                      record,
                      "ui.engagement_priorities",
                      null
                    )}
                  />
                </Grid.Column>
                <Grid.Column>
                  <TargetAudienceField
                    required={false}
                    initialSuggestions={_get(
                      record,
                      "ui.target_audiences",
                      null
                    )}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("5. Additional details"),
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <VersionField />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={16}>
                  <DatesField options={this.vocabularies.metadata.dates} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={16}>
                  <LocationsField
                    label={"Locations"}
                    fieldPath={"metadata.locations.features"}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("6. Publisher, awards and licenses"),
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <PublisherField />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row centered>
                <Grid.Column width={16}>
                  <LicenseField
                    fieldPath="metadata.rights"
                    searchConfig={{
                      searchApi: {
                        axios: {
                          headers: {
                            Accept: "application/vnd.inveniordm.v1+json",
                          },
                          url: "/api/vocabularies/licenses",
                          withCredentials: false,
                        },
                      },
                      initialQueryState: {
                        filters: [["tags", "recommended"]],
                      },
                    }}
                    serializeLicenses={(result) => ({
                      title: result.title_l10n,
                      description: result.description_l10n,
                      id: result.id,
                      link: result.props.url,
                    })}
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <FundingField
                    fieldPath="metadata.funding"
                    searchConfig={{
                      searchApi: {
                        axios: {
                          headers: {
                            Accept: "application/vnd.inveniordm.v1+json",
                          },
                          url: "/api/awards",
                          withCredentials: false,
                        },
                      },
                      initialQueryState: {
                        sortBy: "bestmatch",
                        sortOrder: "asc",
                        layout: "list",
                        page: 1,
                        size: 5,
                      },
                    }}
                    label="Awards"
                    labelIcon="money bill alternate outline"
                    deserializeAward={(award) => {
                      return {
                        title: award.title_l10n,
                        number: award.number,
                        funder: award.funder ?? "",
                        id: award.id,
                        ...(award.identifiers && {
                          identifiers: award.identifiers,
                        }),
                        ...(award.acronym && { acronym: award.acronym }),
                      };
                    }}
                    deserializeFunder={(funder) => {
                      return {
                        id: funder.id,
                        name: funder.name,
                        ...(funder.title_l10n && { title: funder.title_l10n }),
                        ...(funder.pid && { pid: funder.pid }),
                        ...(funder.country && { country: funder.country }),
                        ...(funder.identifiers && {
                          identifiers: funder.identifiers,
                        }),
                      };
                    }}
                    computeFundingContents={(funding) => {
                      let headerContent,
                        descriptionContent,
                        awardOrFunder = "";

                      if (funding.funder) {
                        const funderName =
                          funding.funder?.name ??
                          funding.funder?.title ??
                          funding.funder?.id ??
                          "";
                        awardOrFunder = "funder";
                        headerContent = funderName;
                        descriptionContent = "";

                        // there cannot be an award without a funder
                        if (funding.award) {
                          awardOrFunder = "award";
                          descriptionContent = funderName;
                          headerContent = funding.award.title;
                        }
                      }

                      return {
                        headerContent,
                        descriptionContent,
                        awardOrFunder,
                      };
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("7. Related identifiers"),
        render: () => (
          <Tab.Pane as={Segment}>
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <IdentifiersField
                    fieldPath="metadata.identifiers"
                    label={i18next.t("Alternate identifiers")}
                    labelIcon="barcode"
                    schemeOptions={
                      this.vocabularies.metadata.identifiers.scheme
                    }
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row centered>
                <Grid.Column width={16}>
                  <RelatedWorksField
                    options={this.vocabularies.metadata.identifiers}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
    ];

    // Auxiliary data
    if (resourceTypeSelected.length === 0) {
      this.filterResourceTypes(resourceBaseTypeSelected);
    }

    return (
      <DepositFormApp
        config={this.config}
        record={record}
        files={files}
        permissions={permissions}
      >
        <Menu attached={"top"} size={"huge"} widths={3}>
          {Object.keys(this.menuPanes).map((menuPane) => {
            const menuPaneDefinition = this.menuPanes[menuPane];

            return (
              <Menu.Item
                name={menuPaneDefinition.id}
                active={menuActive === menuPaneDefinition.id}
                onClick={async () => {
                  await this.handleMenuStep(menuPaneDefinition.id);
                }}
              >
                <Icon name={menuPaneDefinition.title} />{" "}
                {menuPaneDefinition.title}
              </Menu.Item>
            );
          })}
        </Menu>
        <>
          {menuActive === this.menuPanes.metadata.id && (
            <Segment attached basic>
              <Tab
                panes={panes}
                menu={{
                  stackable: true,
                  pointing: true,
                  fluid: true,
                  simple: true,
                  widths: panes.length,
                }}
                onTabChange={this.stepChangeHandler}
                activeIndex={stepActive}
              />
            </Segment>
          )}

          {menuActive === this.menuPanes.files.id && (
            <Segment attached basic>
              <Grid verticalAlign="middle" centered>
                <Grid.Row>
                  <Grid.Column>
                    <FileUploader
                      isDraftRecord={!record.is_published}
                      quota={this.config.quota}
                      decimalSizeDisplay={this.config.decimal_size_display}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          )}

          {menuActive === this.menuPanes.permissions.id && (
            <Segment attached basic>
              <Grid verticalAlign="middle" centered>
                <Grid.Row fluid>
                  <Grid.Column width={8}>
                    <AccessRightFieldResource
                      // label={i18next.t("Visibility")}
                      // labelIcon="shield"
                      packageRecord={modalPackageRecord}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          )}
        </>

        <Segment basic className="mt-0">
          <Grid>
            <Grid.Row>
              <Grid.Column width={4} floated={"right"}>
                <div>
                  <SaveButtonResource
                    fluid
                    primary
                    content={i18next.t("Add resource")}
                    confirmOperation={(operation) => {
                      this.updateConfirmationModalDefinitions({
                        open: true,
                        title: i18next.t("Add resource"),
                        content: i18next.t(
                          "Are you sure you want to add this new resource to the package ?"
                        ),
                        onAccept: (e) => {
                          this.updateConfirmationModalDefinitions({
                            open: false,
                          });
                          operation();
                        },
                        onRefuse: (e) => {
                          this.updateConfirmationModalDefinitions({
                            open: false,
                          });
                        },
                        onClose: (e) => {
                          this.updateConfirmationModalDefinitions({
                            open: false,
                          });
                        },
                      });
                    }}
                  />
                </div>

                <div className="mt-5">
                  <DeleteButton
                    fluid
                    updateUrlAfterDelete={false}
                    isPublished={record.is_published}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <DraftController
          shouldUpdate={!dataSentToStore}
          onDepositSaveDraft={onDepositSaveDraft}
        />
        <StepController
          shouldUpdate={!dataSentToStore}
          handleStep={this.handleMenuAndMetadataSteps}
        />

        <FormRefresher
          shouldUpdate={!dataSentToStore}
          resourceType={resourceBaseTypeSelected}
          onFinishDeposit={onFinishDeposit}
          onDepositDelete={onDepositDelete}
          reportOperationStatus={async (status) => {
            if (status) {
              await this.dataSentToStoreHandler();
            }
          }}
        />

        <ConfirmationModal {...confirmationModalDefinitions} />
      </DepositFormApp>
    );
  }
}

/**
 * Resource Modal Content Component.
 */
export const ResourceModal = ({
  modalOpen,
  modalOnClose,
  modalData,
  modalPackageRecord,
  depositOnFinish,
  depositOnDelete,
  depositOnSaveDraft,
}) => {
  // States
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // Confirmation modal configuration
  const confirmationModalConfiguration = {
    title: i18next.t("Resource deposit"),
    content: i18next.t(
      "Are you sure you want to leave? You " +
        "will lose all edits, and the resource will " +
        "not be saved in the package."
    ),
    onAccept: (e) => {
      modalOnClose();
      setConfirmationModalOpen(false);
    },
    onRefuse: (e) => {
      setConfirmationModalOpen(false);
    },
    onClose: (e) => {
      setConfirmationModalOpen(false);
    },
  };

  return (
    <>
      <Modal
        closeIcon
        size={"large"}
        centered={false}
        open={modalOpen}
        onClose={() => {
          setConfirmationModalOpen(true);
        }}
        closeOnEscape
        closeOnDimmerClick
      >
        <Modal.Content style={{ padding: 0 }}>
          <ResourceModalContent
            onFinishDeposit={depositOnFinish}
            onDepositDelete={depositOnDelete}
            onDepositSaveDraft={depositOnSaveDraft}
            modalPackageRecord={modalPackageRecord}
            {...modalData}
          />
        </Modal.Content>
      </Modal>

      <ConfirmationModal
        open={confirmationModalOpen}
        {...confirmationModalConfiguration}
      />
    </>
  );
};
