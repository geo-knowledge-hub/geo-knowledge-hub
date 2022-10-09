/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import _get from "lodash/get";
import _compact from "lodash/compact";
import { Grid, Tab, Modal, Segment } from "semantic-ui-react";

import {
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
  SaveRecordButton,
  connect,
} from "@geo-knowledge-hub/geo-deposit-react";

import { axiosWithconfig } from "@invenio-app-rdm/utils";

import {
  TargetAudienceField,
  EngagementPriorityField,
  WorkProgrammeActivityField,
} from "@geo-knowledge-hub/geo-components-react";

import { LocationsField } from "@geo-knowledge-hub/invenio-geographic-components-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Modal refresher component.
 *
 * (Initial approach)
 */
const FormRefresherComponent = ({
  deposit,
  modalHandler,
  searchHandler,
  packageContext,
}) => {
  const refresh = () => {
    // Closing the modal
    setTimeout(() => {
      modalHandler.setState({ open: false });
    }, 200);

    setTimeout(() => {
      searchHandler.setState({ updateSearch: true });
    }, 300);
  };

  const { actionState, record } = deposit;

  if (
    Object.keys(packageContext).length > 0 &&
    actionState === "DRAFT_SAVE_SUCCEEDED"
  ) {
    axiosWithconfig
      .post(packageContext.apiUrl, {
        resources: [
          {
            id: record.id,
            type: "managed",
          },
        ],
      })
      .then((res) => {
        refresh();
      });
  } else if (actionState === "DRAFT_SAVE_SUCCEEDED") {
    refresh();
  }

  return <></>;
};

const FormRefresher = connect(FormRefresherComponent);

/**
 * (Base component) Step Controller Component.
 *
 * (Initial approach)
 */
class StepControllerComponent extends Component {
  constructor(props) {
    super(props);

    this.handleStep = props.handleStep;

    // Actions where the `StepController` must act.
    this.validActions = [
      "DRAFT_SAVE_STARTED",
      "DRAFT_SAVE_FAILED",
      "DRAFT_HAS_VALIDATION_ERRORS",
    ];
  }

  render() {
    if (this.validActions.includes(this.props.deposit.actionState)) {
      this.handleStep(0); // changing to the initial step
    }

    return <></>;
  }
}

/**
 * Step Controller Component.
 */
const StepController = connect(StepControllerComponent);

/**
 * (Base component) Resource Modal Content Component.
 */
export class ResourceModalContent extends Component {
  constructor(props) {
    super(props);
    const depositConfigurations = props.config;

    // API definitions to create new records and associate them
    // to the related package.
    this.config = depositConfigurations.configRecordDeposit || {};

    // API definitions of the package associated
    // with the manipulated record.
    this.packageContext = depositConfigurations.config || {};

    // Handlers for the modal and search components.
    this.modalHandler = depositConfigurations.modal || {};
    this.searchHandler = depositConfigurations.search || {};

    const { files, record } = depositConfigurations;

    this.config["canHaveMetadataOnlyRecords"] = true;

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

    // check if files are present
    this.noFiles = false;
    if (
      !Array.isArray(files.entries) ||
      (!files.entries.length && record.is_published)
    ) {
      this.noFiles = true;
    }

    // States
    this.state = {
      activeIndex: 0,
    };

    this.maxPanes = 8;
  }

  /**
   * Handle form steps.
   * @param {int} step Number of the new step.
   */
  handleStep = (step) => {
    if (step <= this.maxPanes && step >= 0) {
      this.setState({ ...this.state, activeIndex: step });
    }
  };

  /**
   * Handle the modification on the Tab.
   */
  handleChange = (e, data) => {
    this.setState(data);
  };

  render() {
    const { record, files, permissions } = this.props;

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

              <Grid.Row centered>
                <Grid.Column width={16}>
                  <ResourceTypeField
                    options={this.vocabularies.metadata.resource_type}
                    required
                  />
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
        menuItem: i18next.t("4. Initiatives and audience"),
        render: () => (
          <Tab.Pane>
            <Grid verticalAlign="middle" centered>
              <Grid.Row>
                <Grid.Column width={16}>
                  <WorkProgrammeActivityField
                    required
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
                    required
                    initialSuggestions={_get(
                      record,
                      "ui.engagement_priorities",
                      null
                    )}
                  />
                </Grid.Column>
                <Grid.Column>
                  <TargetAudienceField
                    required
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
        menuItem: i18next.t("6. Files"),
        render: () => (
          <Tab.Pane>
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
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("7. Publisher, awards and licenses"),
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <PublisherField />
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
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: i18next.t("8. Related identifiers"),
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

    return (
      <DepositFormApp
        config={this.config}
        record={record}
        files={files}
        permissions={permissions}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Tab
                panes={panes}
                menu={{
                  stackable: true,
                  pointing: true,
                  fluid: true,
                  widths: 8,
                }}
                onTabChange={this.handleChange}
                activeIndex={this.state.activeIndex}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid>
          <Grid.Row>
            <Grid.Column width={8} floated={"right"} textAlign={"right"}>
              <SaveRecordButton content={"Add resource"} primary />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <StepController handleStep={this.handleStep} />
        <FormRefresher
          modalHandler={this.modalHandler}
          searchHandler={this.searchHandler}
          packageContext={this.packageContext}
        />
      </DepositFormApp>
    );
  }
}

/**
 * Resource Modal Content Component.
 */
export const ResourceModal = ({
  isModalOpen,
  onClose,
  ...depositFormAppProps
}) => (
  <Modal
    closeIcon
    size={"large"}
    centered={false}
    dimmer={"blurring"}
    open={isModalOpen}
    onClose={onClose}
    closeOnEscape={false}
    closeOnDimmerClick={false}
  >
    <Modal.Content>
      <ResourceModalContent {...depositFormAppProps} />
    </Modal.Content>
  </Modal>
);
