import _ from 'lodash'
import React, { Component, createRef, Fragment } from 'react';

import { Container } from "semantic-ui-react";
import { DepositStep } from "./geo/components/DepositStep";

import { GlobalDndContext } from "./geo/DNDGlobalContextHandler";

import { DepositConfigHandler } from "./geo/DepositConfigHandler";
import { LibraryVocabularyHandler } from "./geo/LibraryVocabularyHandler";

import { Provider } from "react-redux";
import { geoGlobalContext, geoGlobalStore } from "./configStore";

import { DataForm } from "./geo/components/DataForm";
import { SoftwareForm } from "./geo/components/SoftwareForm";
import { PublicationsForm } from "./geo/components/PublicationsForm";
import { KnowledgePackageForm } from "./geo/components/KnowledgePackageForm";
import { EditResourceForm } from './geo/components/EditResourceForm';
import { KNOWLEDGE_PACKAGE } from './geo/resources/types';
import { OthersForm } from './geo/components/OthersForm';


class KnowledgePackageDepositSteps extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // if is a resource and is a knowledge package, then, show the steps (ToDo: Split this components in two others).
        switch (this.props.step) {
            case 1:  // general step
                return (
                    <KnowledgePackageForm
                        contextInfo={this.props.contextInfo}
                        depositConfigHandler={this.props.depositConfigHandler}
                        libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
                    />
                );

            case 2: // publications step
                return (
                    <PublicationsForm
                        contextInfo={this.props.contextInfo}
                        depositConfigHandler={this.props.depositConfigHandler}
                        libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
                    />
                )

            case 3: // data step
                return (
                    <DataForm
                        contextInfo={this.props.contextInfo}
                        depositConfigHandler={this.props.depositConfigHandler}
                        libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
                    />
                )

            case 4: // software
                return (
                    <SoftwareForm
                        contextInfo={this.props.contextInfo}
                        depositConfigHandler={this.props.depositConfigHandler}
                        libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
                    />
                );
            case 5: // others 
                return (
                    <OthersForm
                        contextInfo={this.props.contextInfo}
                        depositConfigHandler={this.props.depositConfigHandler}
                        libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
                    />
                );

            default:
                return null;
        }

    }
};

export class KnowledgePackageDepositApp extends Component {
    sidebarRef = createRef();
    sidebarMenuRef = createRef();

    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            stepName: "general",
            knowledgePackageRecord: null
        };

        this.depositConfigHandler = new DepositConfigHandler({
            record: props.record,
            files: props.files,
            config: props.config,
            permissions: props.permissions,
        });

        this.libraryVocabulariesHandler = new LibraryVocabularyHandler(props.config.vocabularies);

        this.stepNames = ["general", "publications", "data", "software", "others"];
    }

    next = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                step: prevState.step + 1,
                stepName: this.stepNames[prevState.step]
            }
        });
    }

    previous = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                step: prevState.step - 1,
                stepName: this.stepNames[prevState.step - 2]
            }
        });
    }

    render() {
        const { step, stepName } = this.state;
        const stepHandler = {
            next: this.next,
            previous: this.previous
        };

        const contextInfo = { // preparing the context props
            step: step,
            stepHandler: stepHandler,
            sidebarMenuRef: this.sidebarMenuRef
        };

        let isKnowledgePackage = true;
        if (this.depositConfigHandler.props.record.id != null) {
            if (this.depositConfigHandler.props.record.metadata.resource_type.title.en !== KNOWLEDGE_PACKAGE) {
                isKnowledgePackage = false;
            }
        }

        if (isKnowledgePackage) {
            return (
                <GlobalDndContext>
                    <Provider store={geoGlobalStore} context={geoGlobalContext}>
                        <Container style={{ marginTop: "10px" }}>
                            <DepositStep stepName={stepName} context={this.sidebarRef} />
                            <KnowledgePackageDepositSteps
                                step={step}
                                contextInfo={contextInfo}
                                depositConfigHandler={this.depositConfigHandler}
                                libraryVocabulariesHandler={this.libraryVocabulariesHandler}
                            />
                        </Container>
                    </Provider>
                </GlobalDndContext>
            );
        } else {
            return (
                <Provider store={geoGlobalStore} context={geoGlobalContext}>
                    <EditResourceForm
                        contextInfo={contextInfo}
                        depositConfigHandler={this.depositConfigHandler}
                        libraryVocabulariesHandler={this.libraryVocabulariesHandler}
                    >
                    </EditResourceForm>
                </Provider>
            );
        }
    }
};
