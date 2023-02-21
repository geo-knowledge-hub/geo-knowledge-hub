// This file is part of InvenioRDM
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021-2022 Graz University of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component, createRef, Fragment } from "react";

import _get from "lodash/get";
import _compact from "lodash/compact";

import { Provider, connect, useStore } from "react-redux";

import { AccordionField, CustomFields } from "react-invenio-forms";
import { Card, Container, Grid, Ref, Sticky, Button } from "semantic-ui-react";

import {
  AccessRightField,
  CommunityHeader,
  CreatibutorsField,
  DatesField,
  DeleteButton,
  DepositFormApp,
  DepositStatusBox,
  DescriptionsField,
  FileUploader,
  FormFeedback,
  IdentifiersField,
  LanguagesField,
  LicenseField,
  PIDField,
  PreviewButton,
  PublicationDateField,
  PublishButton,
  PublisherField,
  RelatedWorksField,
  SaveButton,
  SubjectsField,
  TitlesField,
  VersionField,
  FundingField,
  connect as connectToDepositContext,
} from "@geo-knowledge-hub/geo-deposit-react";

import {
  TargetAudienceField,
  EngagementPriorityField,
  WorkProgrammeActivityField,
} from "@geo-knowledge-hub/geo-components-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { LocationsField } from "@geo-knowledge-hub/invenio-geographic-components-react";

import { storageReloadPackageRecord } from "../../../state/operations/storage";

class PackageRefresherComponent extends Component {
  render() {
    // Props (Deposit operation)
    const { deposit } = this.props;
    const { actionState, record } = deposit;

    // Props (Deposit layout)
    const {
      dispatchStorageReloadPackageRecord,
      reportOperationStatus,
      shouldUpdate,
    } = this.props;

    if (record.id && shouldUpdate && actionState === "DRAFT_SAVE_SUCCEEDED") {
      dispatchStorageReloadPackageRecord(record);

      reportOperationStatus(true);
    }

    return <></>;
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchStorageReloadPackageRecord: (baseRecord) =>
    dispatch(storageReloadPackageRecord(baseRecord)),
});

export const PackageRefresher = connect(
  null,
  mapDispatchToProps
)(PackageRefresherComponent);

export const PackageRefresherHOC = (store) => {
  const Component = ({ ...args }) => (
    <Provider store={store}>
      <PackageRefresher {...args} />
    </Provider>
  );

  return connectToDepositContext(Component);
};

export class PackageDepositFormComponentBase extends Component {
  sidebarRef = createRef();
  formFeedbackRef = createRef();

  state = {
    dataSentToStore: false, // flag to avoid multiple modifications in the store.
  };

  constructor(props) {
    super(props);

    // Base storage objects.
    const { packageObject, depositConfig } = this.props;
    const { record, files } = packageObject;

    // Defining properties.
    this.config = depositConfig.package.record || {};
    this.packageObject = packageObject;

    // Configuring.
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
  }

  dataSentToStoreHandler = async (status) => {
    await this.setState({ ...this.state, dataSentToStore: status });
  };

  render() {
    // Props (Store)
    const { store } = this.props;

    // Props (Deposit operation)
    const { record, files, permissions, community } = this.packageObject;

    // Props (Auxiliary components)
    const { formActivator } = this.props;

    // States
    const { dataSentToStore } = this.state;

    // Auxiliary components
    const customFieldsUI = this.config.custom_fields.ui;

    const PackageRefresher = PackageRefresherHOC(store);

    return (
      <DepositFormApp
        config={this.config}
        record={record}
        preselectedCommunity={community}
        files={files}
        permissions={permissions}
      >
        <FormFeedback fieldPath="message" />
        <CommunityHeader imagePlaceholderLink="/static/images/square-placeholder.png" />
        <Container id="rdm-deposit-form" className="rel-mt-1">
          <Grid className="mt-25">
            <Grid.Column mobile={16} tablet={16} computer={11}>
              <AccordionField
                includesPaths={["files.enabled"]}
                active
                label={i18next.t("Files")}
              >
                {this.noFiles && record.is_published && (
                  <div className="text-align-center pb-10">
                    <em>{i18next.t("The record has no files.")}</em>
                  </div>
                )}
                <FileUploader
                  isDraftRecord={!record.is_published}
                  quota={this.config.quota}
                  decimalSizeDisplay={this.config.decimal_size_display}
                />
              </AccordionField>

              <AccordionField
                includesPaths={[
                  "metadata.title",
                  "metadata.publication_date",
                  "metadata.additional_titles",
                ]}
                active
                label={i18next.t("Basic information")}
              >
                <TitlesField
                  options={this.vocabularies.metadata.titles}
                  fieldPath="metadata.title"
                  recordUI={record.ui}
                  required
                />

                <PublicationDateField
                  required
                  fieldPath="metadata.publication_date"
                />

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
              </AccordionField>

              <AccordionField
                includesPaths={[
                  "metadata.description",
                  "metadata.additional_descriptions",
                  "metadata.languages",
                ]}
                active
                label={i18next.t("Description and languages")}
              >
                <LanguagesField
                  fieldPath="metadata.languages"
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

                <DescriptionsField
                  fieldPath="metadata.description"
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
                />
              </AccordionField>

              <AccordionField
                includesPaths={["metadata.creators", "metadata.contributors"]}
                active
                label={i18next.t("People")}
              >
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
                        roleOptions={
                          this.vocabularies.metadata.contributors.role
                        }
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
              </AccordionField>

              <AccordionField
                includesPaths={[
                  "metadata.geo_work_programme_activity",
                  "metadata.engagement_priorities",
                  "metadata.target_audiences",
                  "metadata.subjects",
                ]}
                active
                label={i18next.t("Initiatives, audiences, and subjects")}
              >
                <SubjectsField
                  fieldPath="metadata.subjects"
                  initialOptions={_get(record, "ui.subjects", null)}
                  limitToOptions={this.vocabularies.metadata.subjects.limit_to}
                />
                <WorkProgrammeActivityField
                  required={false}
                  initialSuggestions={
                    _compact([
                      _get(record, "ui.geo_work_programme_activity", null),
                    ]) || null
                  }
                />

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
              </AccordionField>

              <AccordionField
                includesPaths={["metadata.version", "metadata.dates"]}
                active
                label={i18next.t("Dates and version")}
              >
                <VersionField fieldPath="metadata.version" />
                <DatesField
                  fieldPath="metadata.dates"
                  options={this.vocabularies.metadata.dates}
                  showEmptyValue
                />
              </AccordionField>

              <AccordionField
                includesPaths={["metadata.locations"]}
                active
                label={i18next.t("Geographic locations")}
              >
                <LocationsField
                  label={"Locations"}
                  fieldPath={"metadata.locations.features"}
                />
              </AccordionField>

              <AccordionField
                includesPaths={["metadata.publisher", "metadata.rights"]}
                active
                label={i18next.t("Publisher and licenses")}
              >
                <PublisherField fieldPath="metadata.publisher" />

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
              </AccordionField>

              <AccordionField
                includesPaths={["metadata.funding"]}
                active
                label={i18next.t("Funding")}
              >
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

                    return { headerContent, descriptionContent, awardOrFunder };
                  }}
                />
              </AccordionField>

              <AccordionField
                includesPaths={["metadata.identifiers"]}
                active
                label={i18next.t("Alternate identifiers")}
              >
                <IdentifiersField
                  fieldPath="metadata.identifiers"
                  label={i18next.t("Alternate identifiers")}
                  labelIcon="barcode"
                  schemeOptions={this.vocabularies.metadata.identifiers.scheme}
                  showEmptyValue
                />
              </AccordionField>

              <AccordionField
                includesPaths={["metadata.related_identifiers"]}
                active
                label={i18next.t("Related works")}
              >
                <RelatedWorksField
                  fieldPath="metadata.related_identifiers"
                  options={this.vocabularies.metadata.identifiers}
                  showEmptyValue
                />
              </AccordionField>
              <CustomFields
                config={customFieldsUI}
                templateLoader={(widget) =>
                  import(`@templates/custom_fields/${widget}.js`)
                }
                fieldPathPrefix="custom_fields"
              />
            </Grid.Column>
            <Ref innerRef={this.sidebarRef}>
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={5}
                className="deposit-sidebar"
              >
                <Sticky context={this.sidebarRef} offset={20}>
                  {formActivator}

                  <Card>
                    <Card.Content>
                      <DepositStatusBox />
                    </Card.Content>
                    <Card.Content>
                      <Grid relaxed>
                        <Grid.Column
                          computer={8}
                          mobile={16}
                          className="pb-0 left-btn-col"
                        >
                          <SaveButton fluid />
                        </Grid.Column>

                        <Grid.Column
                          computer={8}
                          mobile={16}
                          className="pb-0 right-btn-col"
                        >
                          <PreviewButton fluid />
                        </Grid.Column>

                        <Grid.Column width={16} className="pt-10">
                          <PublishButton fluid />
                        </Grid.Column>
                      </Grid>
                    </Card.Content>
                  </Card>

                  <AccessRightField
                    label={i18next.t("Visibility")}
                    labelIcon="shield"
                    fieldPath="access"
                  />

                  {permissions?.can_delete_draft && (
                    <Card>
                      <Card.Content>
                        <DeleteButton
                          fluid
                          // TODO: make is_published part of the API response
                          //       so we don't have to do this
                          isPublished={record.is_published}
                        />
                      </Card.Content>
                    </Card>
                  )}
                </Sticky>
              </Grid.Column>
            </Ref>
          </Grid>

          <PackageRefresher
            shouldUpdate={!dataSentToStore}
            reportOperationStatus={async (status) => {
              await this.dataSentToStoreHandler(status);
            }}
          />
        </Container>
      </DepositFormApp>
    );
  }

  /**
   * (Temporary and not recommend approach) We avoid rerendering here to enable another
   * update in the interface (e.g., Steps modification) without creating conflicts between
   * the components.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }
}

const PackageDepositFormComponent = ({ ...args }) => {
  const store = useStore();

  return <PackageDepositFormComponentBase store={store} {...args} />;
};

const mapStateToProps = (state) => ({
  packageObject: state.storage.packageObject,
  depositConfig: state.storage.depositConfig,
});

export const PackageDepositForm = connect(
  mapStateToProps,
  null
)(PackageDepositFormComponent);

// ToDo
// PackageDepositForm.propTypes = {
//   config: PropTypes.object.isRequired,
//   record: PropTypes.object.isRequired,
//   preselectedCommunity: PropTypes.object,
//   files: PropTypes.object,
//   permissions: PropTypes.object,
// };
//
// PackageDepositForm.defaultProps = {
//   preselectedCommunity: undefined,
//   permissions: null,
//   files: null,
// };
