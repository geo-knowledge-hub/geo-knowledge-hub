import React, { Fragment } from "react";

import _get from "lodash/get";
import _compact from "lodash/compact";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { AccordionField } from "react-invenio-forms";

import {
  AccessRightField,
  DescriptionsField,
  TitlesField,
  ResourceTypeField,
  PublicationDateField,
  CreatibutorsField,
  LanguagesField,
  VersionField,
  LicenseField,
  SaveButton,
  PIDField,
  PreviewButton,
  PublishButton,
  FileUploader,
  DepositFormTitle,
  FormFeedback,
} from "react-invenio-deposit";

import {
  Container,
  Grid,
  Segment,
  Ref,
  Sticky,
  Card,
  Button,
  Divider,
} from "semantic-ui-react";

import {
  SubjectsField,
  TargetAudienceField,
  EngagementPrioritiesField,
} from "geo-labels-react";

import { BaseDepositForm } from "./BaseDepositForm";
import { GeoDepositFormApp } from "../GeoDepositFormApp";
import { DepositFormStepButton } from "./DepositFormStepButton";

import { RelatedResourceField } from "./fields/RelatedIdentifiersField";

import { KNOWLEDGE_PACKAGE } from "../resources/types";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { KnowledgePackageField } from "./fields/KnowledgePackage";

export class FullDepositForm extends BaseDepositForm {
  constructor(props) {
    super(props);

    // checking if the resourceType is defined. If false, all resource types (except knowledge packages) are accepted.
    this.isResourcePackage = props.isResourcePackage || false;

    this.resourceTypeWithoutKnowledgePackages =
      this.libraryVocabulariesHandler.filterResourcesByInvalidTypes([
        KNOWLEDGE_PACKAGE,
      ]);

    if (this.isResourcePackage) {
      this.vocabularyResourceTypes = this.resourceTypeWithoutKnowledgePackages;
    } else {
      this.vocabularyResourceTypes =
        this.libraryVocabulariesHandler.filterResourceById(props.resourceType);
    }
  }

  render() {
    // preparing the identifiers object (without the knowledge package)
    const identifiers = {
      ...this.libraryVocabulariesHandler.vocabularies.metadata.identifiers,
      resource_type: this.resourceTypeWithoutKnowledgePackages,
    };

    return (
      <GeoDepositFormApp
        controller={this.props.controller}
        files={this.depositConfigHandler.props.files}
        config={this.depositConfigHandler.props.config}
        record={this.depositConfigHandler.props.record}
        permissions={this.depositConfigHandler.props.permissions}
      >
        <Container style={{ marginTop: "2rem" }}>
          <Grid>
            <Grid.Row>
              <Grid.Column style={{ marginLeft: "2.5rem" }} width={15}>
                <FormFeedback fieldPath="message" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid>
            <Grid.Row>
              <Grid.Column style={{ marginLeft: "2.5rem" }}>
                {this.isResourcePackage && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <DepositFormTitle />
                  </div>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Segment vertical>
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={10}>
                  <AccordionField
                    fieldPath=""
                    active={!this.props.isRecordPublished}
                    label={i18next.t("Files")}
                    ui={this.depositConfigHandler.accordionStyle}
                  >
                    {this.depositConfigHandler.noFiles &&
                      this.depositConfigHandler.props.record.is_published && (
                        <p
                          style={{
                            textAlign: "center",
                            opacity: "0.5",
                            cursor: "default !important",
                          }}
                        >
                          <em>{i18next.t("The record has no files.")}</em>
                        </p>
                      )}
                    <FileUploader
                      isDraftRecord={
                        !this.depositConfigHandler.props.record.is_published
                      }
                      quota={{
                        maxFiles: 100,
                        maxStorage: 10 ** 10,
                      }}
                    />
                  </AccordionField>

                  <AccordionField
                    fieldPath=""
                    active={!this.props.isRecordPublished}
                    label={i18next.t("Basic information")}
                    ui={this.depositConfigHandler.accordionStyle}
                  >
                    <div style={{ display: "none" }}>
                      {this.depositConfigHandler.config.pids.map((pid) => (
                        <Fragment key={pid.scheme}>
                          <PIDField
                            btnLabelDiscardPID={pid.btn_label_discard_pid}
                            btnLabelGetPID={pid.btn_label_get_pid}
                            canBeManaged={pid.can_be_managed}
                            canBeUnmanaged={pid.can_be_unmanaged}
                            fieldPath={`pids.${pid.scheme}`}
                            fieldLabel={pid.field_label}
                            isEditingPublishedRecord={
                              this.depositConfigHandler.props.record
                                .is_published === true // is_published is `null` at first upload
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
                    </div>

                    <TitlesField
                      options={
                        this.libraryVocabulariesHandler.vocabularies.metadata
                          .titles
                      }
                      recordUI={this.depositConfigHandler.props.record.ui}
                      required
                    />

                    <DescriptionsField
                      options={
                        this.libraryVocabulariesHandler.vocabularies.metadata
                          .descriptions
                      }
                      recordUI={_get(
                        this.depositConfigHandler.props.record,
                        "ui",
                        null
                      )}
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

                    <ResourceTypeField
                      options={this.vocabularyResourceTypes}
                      required
                    />

                    <Segment vertical>
                      <SubjectsField
                        initialValues={_compact(
                          _get(
                            this.depositConfigHandler.props.record,
                            "metadata.subjects",
                            []
                          )
                        )}
                        limitToOptions={
                          // Temporary solution:
                          //    In the future, these values will be retrieved
                          //    from the backend.
                          // this.libraryVocabulariesHandler.vocabularies.metadata
                          // .subjects.limit_to
                          [{ text: "FOS", value: "FOS" }]
                        }
                      />

                      <div style={{ marginBottom: "1rem" }}>
                        <Grid columns={2} divided>
                          <Grid.Row>
                            <Grid.Column>
                              <EngagementPrioritiesField
                                subjectProps={{
                                  scheme: "EP",
                                  fieldPath: "metadata.subjects",
                                  initialValues: _compact(
                                    _get(
                                      this.depositConfigHandler.props.record,
                                      "metadata.subjects",
                                      []
                                    )
                                  ),
                                }}
                              />
                            </Grid.Column>
                            <Grid.Column>
                              <TargetAudienceField
                                subjectProps={{
                                  scheme: "TU",
                                  fieldPath: "metadata.subjects",
                                  initialValues: _compact(
                                    _get(
                                      this.depositConfigHandler.props.record,
                                      "metadata.subjects",
                                      []
                                    )
                                  ),
                                }}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </div>

                      <LanguagesField
                        initialOptions={_get(
                          this.depositConfigHandler.props.record,
                          "ui.languages",
                          []
                        ).filter((lang) => lang !== null)} // needed because dumped empty record from backend gives [null]
                        serializeSuggestions={(suggestions) =>
                          suggestions.map((item) => ({
                            text: item.title_l10n,
                            value: item.id,
                            key: item.id,
                          }))
                        }
                      />

                      <PublicationDateField required />

                      {this.isResourcePackage && (
                        <KnowledgePackageField
                          fieldPath={"metadata.related_identifiers"}
                          label={"Associated Knowledge Package"}
                          labelIcon={"box"}
                          searchConfig={{
                            searchApi: {
                              axios: {
                                headers: {
                                  Accept: "application/vnd.inveniordm.v1+json",
                                },
                                url: "/api/user/records",
                                withCredentials: true,
                              },
                            },
                            initialQueryState: {
                              filters: [],
                            },
                          }}
                          serializeKnowledgePackage={(result) => {
                            return {
                              identifier: result.pids.doi.identifier,
                              relation_type: "ispartof",
                              resource_type: "knowledge",
                              scheme: "doi",
                            };
                          }}
                        />
                      )}
                    </Segment>
                  </AccordionField>

                  <AccordionField
                    fieldPath=""
                    active={!this.props.isRecordPublished}
                    label={i18next.t("People")}
                    ui={this.depositConfigHandler.accordionStyle}
                  >
                    <Grid columns={2} divided>
                      <Grid.Row>
                        <Grid.Column>
                          <CreatibutorsField
                            label={i18next.t("Creators")}
                            labelIcon={"user"}
                            fieldPath={"metadata.creators"}
                            roleOptions={
                              this.libraryVocabulariesHandler.vocabularies
                                .metadata.creators.role
                            }
                            schema="creators"
                            required
                          />
                        </Grid.Column>

                        <Grid.Column>
                          <CreatibutorsField
                            addButtonLabel={i18next.t("Add contributor")}
                            label={i18next.t("Contributors")}
                            labelIcon={"user plus"}
                            fieldPath={"metadata.contributors"}
                            roleOptions={
                              this.libraryVocabulariesHandler.vocabularies
                                .metadata.contributors.role
                            }
                            schema="contributors"
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
                    fieldPath=""
                    active={!this.props.isRecordPublished}
                    label={i18next.t("License and version")}
                    ui={this.depositConfigHandler.accordionStyle}
                  >
                    <VersionField />

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
                    fieldPath=""
                    active={!this.props.isRecordPublished}
                    label={"Related resources"}
                    ui={this.depositConfigHandler.accordionStyle}
                  >
                    <RelatedResourceField options={identifiers} />
                    <br />
                  </AccordionField>
                </Grid.Column>
                <Ref innerRef={this.props.contextInfo.sidebarMenuRef}>
                  <Grid.Column width={5} className="deposit-sidebar">
                    <Sticky
                      context={this.props.contextInfo.sidebarMenuRef}
                      offset={20}
                    >
                      {!this.isResourcePackage && this.props.isRecordPublished && (
                        <Card className="actions">
                          <Card.Content>
                            <Button
                              fluid
                              content="Go to Knowledge Package"
                              href={_get(
                                this.depositConfigHandler.props.record,
                                "links.record_html"
                              )}
                            />
                          </Card.Content>
                        </Card>
                      )}

                      <Card className="actions">
                        <Card.Content>
                          <div className="sidebar-buttons">
                            <SaveButton fluid className="save-button" />
                            <PreviewButton fluid className="preview-button" />
                          </div>
                          <PublishButton fluid />
                        </Card.Content>
                      </Card>

                      <AccessRightField
                        label={i18next.t("Visibility")}
                        labelIcon={"shield"}
                      />
                    </Sticky>
                  </Grid.Column>
                </Ref>
              </Grid.Row>
            </Grid>
          </Segment>

          {!this.isResourcePackage && (
            <Segment vertical align="center">
              <DepositFormStepButton
                next={this.props.contextInfo.stepHandler.next}
                isNextActivated={this.props.isRecordPublished}
              />
            </Segment>
          )}
        </Container>
      </GeoDepositFormApp>
    );
  }
}
