
import Swal from 'sweetalert2';

import { connect } from "react-redux";
import React, { Fragment } from "react";

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
    PIDField
} from "react-invenio-deposit";

import {
    Modal,
    Tab,
    Grid,
    Container,
    Segment,
    Divider
} from "semantic-ui-react";

import { BaseDepositForm } from "../BaseDepositForm";
import { GeoDepositFormApp } from "../../GeoDepositFormApp";
import { KnowledgeResourceDepositController } from "../../controllers/KnowledgeResourceDepositController";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { CustomRDMPublishButton } from "../buttons/CustomRDMPublishButton";

import { geoGlobalContext, geoGlobalStore } from "../../../configStore";
import { ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED_FINISH } from "../../state/types";

class KnowledgeResourceFormTabs {

    constructor(depositConfigHandler, vocabularyResourceTypes, libraryVocabulariesHandler) {
        // defining configuration properties
        this.depositConfigHandler = depositConfigHandler || {};
        this.vocabularyResourceTypes = vocabularyResourceTypes || {};
        this.libraryVocabulariesHandler = libraryVocabulariesHandler || {};
    }

    generateTabMenu() {

        // defining the default pid for the new records
        const pids = [
            {
                btn_label_discard_pid: "Discard the reserved DOI",
                btn_label_get_pid: "Get a DOI now!",
                can_be_managed: true,
                can_be_unmanaged: true,
                managed_help_text: "Reserve a DOI or leave this field blank to have one automatically assigned when publishing.",
                pid_label: "DOI",
                pid_placeholder: "10.1234/datacite.123456",
                scheme: "doi",
                unmanaged_help_text: "Copy and paste here your DOI"
            }
        ]

        const panes = [
            {
                menuItem: "1. Basic description",
                render: () =>
                    <Tab.Pane>

                        <Grid>

                            <Grid.Row centered>
                                <Grid.Column width={16}>
                                    <TitlesField
                                        options={this.libraryVocabulariesHandler.vocabularies.metadata.titles}
                                        required
                                    ></TitlesField>

                                    <Divider />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row centered>
                                <Grid.Column width={16}>
                                    <DescriptionsField
                                        options={this.libraryVocabulariesHandler.vocabularies.metadata.descriptions}
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
            },
            {
                menuItem: "2. DOI minting",
                render: () =>
                    <Tab.Pane>
                        <Grid>
                            <Grid.Row centered>
                                <Grid.Column width={16}>
                                    {pids.map((pid) => (
                                        <Fragment key={pid.scheme}>
                                            <PIDField
                                                btnLabelGetPID={pid.btn_label_get_pid}
                                                canBeManaged={pid.can_be_managed}
                                                canBeUnmanaged={pid.can_be_unmanaged}
                                                fieldPath={`pids.${pid.scheme}`}
                                                isEditingPublishedRecord={
                                                    null // is_published is `null` at first upload
                                                }
                                                managedHelpText={pid.managed_help_text}
                                                pidLabel={pid.pid_label}
                                                pidPlaceholder={pid.pid_placeholder}
                                                pidType={pid.scheme}
                                                unmanagedHelpText={pid.unmanaged_help_text}
                                            />
                                            <Divider />
                                        </Fragment>
                                    ))}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Tab.Pane>
            },
            {
                menuItem: "3. Additional informations",
                render: () =>
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
                                                    this.libraryVocabulariesHandler.vocabularies.metadata.subjects.limit_to
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
            },
            {
                menuItem: "4. People",
                render: () =>
                    <Tab.Pane>
                        <Grid columns={2} divided>
                            <Grid.Row>
                                <Grid.Column>
                                    <CreatibutorsField
                                        label={i18next.t("Creators")}
                                        labelIcon={"user"}
                                        fieldPath={"metadata.creators"}
                                        roleOptions={this.libraryVocabulariesHandler.vocabularies.metadata.creators.role}
                                        schema="creators"
                                        required
                                    />
                                </Grid.Column>

                                <Grid.Column>
                                    <CreatibutorsField
                                        addButtonLabel={i18next.t('Add contributor')}
                                        label={i18next.t('Contributors')}
                                        labelIcon={"user plus"}
                                        fieldPath={"metadata.contributors"}
                                        roleOptions={this.libraryVocabulariesHandler.vocabularies.metadata.contributors.role}
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
            },
            {
                menuItem: "5. Files",
                render: () =>
                    <Tab.Pane>
                        <Grid verticalAlign='middle' centered>
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
            },
            {
                menuItem: "6. Licenses and version",
                render: () =>
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
            }
        ];
        return () => (
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        )
    }

}


export class KnowledgeResourceModalFormComponent extends BaseDepositForm {
    constructor(props) {
        super(props);
    }

    render() {
        const knowledgeResourceFormTabs = new KnowledgeResourceFormTabs(this.props.depositConfigHandler,
            this.props.vocabularyResourceTypes, this.props.libraryVocabulariesHandler);
        const ModalFormTabs = knowledgeResourceFormTabs.generateTabMenu();

        // extracting state
        const { resourcePublishIsPublished } = this.props;

        if (resourcePublishIsPublished) {
            // showing message to user 
            Swal.fire({
                icon: 'success',
                title: 'Resource successfully added',
                showConfirmButton: false,
                timer: 3000
            });

            // dispatching new event
            geoGlobalStore.dispatch({
                type: ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED_FINISH
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
                        createUrl: "/api/records"
                    }}
                >
                    <Modal.Content>
                        <Modal.Description>
                            <Container>
                                <Segment vertical>
                                    <Grid>
                                        <Grid.Row centered>
                                            <Grid.Column width={15}>
                                                <ModalFormTabs />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Container>
                        </Modal.Description>
                    </Modal.Content>

                    <Modal.Actions>
                        <Container>
                            <Grid >
                                <Grid.Row centered style={{ height: '5rem', marginTop: "1.2rem", }}>
                                    <Divider />
                                    <Grid.Column width={3} centered>
                                        <CustomRDMPublishButton fluid/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Container>
                    </Modal.Actions>

                </GeoDepositFormApp>
            </Modal>
        );
    }
};

// redux store config
const mapStateToProps = (state) => ({
    knowledgePackage: state.knowledgePackage,
    resourcePublishIsPublished: state.resourcePublishIsPublished
});

export const KnowledgeResourceModalForm = connect(
    mapStateToProps, null, null, { context: geoGlobalContext }
)(KnowledgeResourceModalFormComponent);
