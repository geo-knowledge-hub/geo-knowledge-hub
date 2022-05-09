import Swal from "sweetalert2";

import { connect } from "react-redux";
import React, { Component } from "react";

import {
  DescriptionsField,
  SubjectsField,
  TitlesField,
  ResourceTypeField,
  PublicationDateField,
  CreatibutorsField,
  LanguagesField,
  VersionField,
  LicenseField,
  FileUploader,
  FormFeedback,
} from "@geo-knowledge-hub/react-invenio-deposit";

import {
  Modal,
  Tab,
  Grid,
  Container,
  Segment,
  Divider,
} from "semantic-ui-react";

import { BaseDepositForm } from "../BaseDepositForm";
import { GeoDepositFormApp } from "../../GeoDepositFormApp";
import { KnowledgeResourceDepositController } from "../../controllers/KnowledgeResourceDepositController";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { CustomRDMPublishButton } from "../buttons/CustomRDMPublishButton";

import { RelatedResourceField } from "../fields/RelatedIdentifiersField";

import { geoGlobalContext, geoGlobalStore } from "../../../configStore";
import {
  ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED_FINISH,
  ACTION_SAVE_KNOWLEDGE_DISABLE,
} from "../../state/types";

class KnowledgeResourceFormTabsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { activeIndex: 0 };

    // defining configuration properties
    this.depositConfigHandler = props.depositConfigHandler || {};
    this.vocabularyResourceTypes = props.vocabularyResourceTypes || {};
    this.libraryVocabulariesHandler = props.libraryVocabulariesHandler || {};
  }

  handleChange = (e, data) => {
    this.setState(data);
  };

  render() {
    if (this.props.knowledgeResourceIsSubmitted) {
      this.setState((previousState) => {
        return {
          ...previousState,
          activeIndex: 0,
        };
      });

      // temporary solution (dispatch action to communicate with modal)
      // FIXME: In the future, change this to a more general solution
      geoGlobalStore.dispatch({
        type: ACTION_SAVE_KNOWLEDGE_DISABLE,
      });
    }

    const panes = [
      {
        menuItem: "1. Basic description",
        render: () => (
          <Tab.Pane>
            <FormFeedback fieldPath="message" />
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <TitlesField
                    options={
                      this.libraryVocabulariesHandler.vocabularies.metadata
                        .titles
                    }
                    required
                  ></TitlesField>

                  <Divider />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <DescriptionsField
                    options={
                      this.libraryVocabulariesHandler.vocabularies.metadata
                        .descriptions
                    }
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
                  <Divider />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "2. Additional informations",
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <ResourceTypeField
                    options={this.vocabularyResourceTypes}
                    required
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Grid.Row centered>
                    <Grid.Column width={16}>
                      <SubjectsField
                        initialOptions={null}
                        limitToOptions={
                          this.libraryVocabulariesHandler.vocabularies.metadata
                            .subjects.limit_to
                        }
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <PublicationDateField required />
                </Grid.Column>

                <Grid.Column>
                  <LanguagesField
                    initialOptions={null}
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
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "3. People",
        render: () => (
          <Tab.Pane>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <CreatibutorsField
                    label={i18next.t("Creators")}
                    labelIcon={"user"}
                    fieldPath={"metadata.creators"}
                    roleOptions={
                      this.libraryVocabulariesHandler.vocabularies.metadata
                        .creators.role
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
                      this.libraryVocabulariesHandler.vocabularies.metadata
                        .contributors.role
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
          </Tab.Pane>
        ),
      },
      {
        menuItem: "4. Files",
        render: () => (
          <Tab.Pane>
            <Grid verticalAlign="middle" centered>
              <Grid.Row>
                <Grid.Column>
                  <FileUploader
                    isDraftRecord={true}
                    quota={{
                      maxFiles: 100,
                      maxStorage: 10 ** 10,
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "5. Licenses and version",
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <VersionField />
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
        menuItem: "6. Related resources",
        render: () => (
          <Tab.Pane>
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <RelatedResourceField
                    options={
                      this.libraryVocabulariesHandler.vocabularies.metadata
                        .identifiers
                    }
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        onTabChange={this.handleChange}
        activeIndex={this.state.activeIndex}
      />
    );
  }
}

// redux store config
const mapStateToPropsTabs = (state) => ({
  knowledgeResourceIsSubmitted: state.knowledgeResourceIsSubmitted,
});

export const KnowledgeResourceFormTabs = connect(
  mapStateToPropsTabs,
  null,
  null,
  { context: geoGlobalContext }
)(KnowledgeResourceFormTabsComponent);

export class KnowledgeResourceModalFormComponent extends BaseDepositForm {
  constructor(props) {
    super(props);
  }

  render() {
    // extracting state
    const { resourcePublishIsPublished } = this.props;

    if (resourcePublishIsPublished) {
      // showing message to user
      Swal.fire({
        icon: "success",
        title: "Resource successfully added",
        showConfirmButton: false,
        timer: 3000,
      });

      // dispatching new event
      geoGlobalStore.dispatch({
        type: ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED_FINISH,
      });

      this.props.modalWindowHandler();
    }

    return (
      <Modal
        closeIcon
        size={"large"}
        centered={false}
        dimmer={"blurring"}
        open={this.props.isModalOpen}
        onClose={this.props.modalWindowHandler}
      >
        <Modal.Header>{this.props.modalName}</Modal.Header>
        <GeoDepositFormApp
          controller={KnowledgeResourceDepositController}
          config={this.depositConfigHandler.props.config}
          apiClientConfig={{
            createUrl: "/api/records",
          }}
        >
          <Modal.Content>
            <Modal.Description>
              <Container>
                <Segment vertical>
                  <Grid>
                    <Grid.Row centered>
                      <Grid.Column width={15}>
                        <KnowledgeResourceFormTabs
                          depositConfigHandler={this.props.depositConfigHandler}
                          vocabularyResourceTypes={
                            this.props.vocabularyResourceTypes
                          }
                          libraryVocabulariesHandler={
                            this.props.libraryVocabulariesHandler
                          }
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Container>
            </Modal.Description>
          </Modal.Content>

          <Modal.Actions>
            <Container>
              <Grid>
                <Grid.Row
                  centered
                  style={{ height: "5rem", marginTop: "1.2rem" }}
                >
                  <Divider />
                  <Grid.Column width={3} centered>
                    <CustomRDMPublishButton fluid />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          </Modal.Actions>
        </GeoDepositFormApp>
      </Modal>
    );
  }
}

// redux store config
const mapStateToProps = (state) => ({
  knowledgePackage: state.knowledgePackage,
  resourcePublishIsPublished: state.resourcePublishIsPublished,
  knowledgeResourceIsSubmitted: state.knowledgeResourceIsSubmitted,
});

export const KnowledgeResourceModalForm = connect(mapStateToProps, null, null, {
  context: geoGlobalContext,
})(KnowledgeResourceModalFormComponent);
