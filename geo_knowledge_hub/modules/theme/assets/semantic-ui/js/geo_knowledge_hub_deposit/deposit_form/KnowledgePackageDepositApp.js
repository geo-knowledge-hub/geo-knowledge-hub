import _ from "lodash";
import { Provider } from "react-redux";
import React, { Component, createRef } from "react";

import { Container } from "semantic-ui-react";
import { DepositStep } from "./geo/components/DepositStep";

import { GlobalDndContext } from "./geo/DNDGlobalContextHandler";

import { DepositConfigHandler } from "./geo/DepositConfigHandler";
import { LibraryVocabularyHandler } from "./geo/LibraryVocabularyHandler";

import { DataForm } from "./geo/components/DataForm";
import { OthersForm } from "./geo/components/OthersForm";
import { SoftwareForm } from "./geo/components/SoftwareForm";
import { PublicationsForm } from "./geo/components/PublicationsForm";

import { KnowledgePackageForm } from "./geo/components/KnowledgePackageForm";
import { KnowledgeResourceForm } from "./geo/components/KnowledgeResourceForm";

import { KNOWLEDGE_PACKAGE } from "./geo/resources/types";
import { geoGlobalContext, geoGlobalStore } from "./configStore";

import "react-semantic-toasts/styles/react-semantic-alert.css";

class KnowledgePackageDepositSteps extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // if is a resource and is a knowledge package, then, show the steps (ToDo: Split this components in two others).
    switch (this.props.step) {
      case 1: // general step
        return (
          <KnowledgePackageForm
            sidebarMenuRef={this.props.sidebarMenuRef}
            isRecordPublished={this.props.isRecordPublished}
            depositConfigHandler={this.props.depositConfigHandler}
            libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
          />
        );

      case 2: // publications step
        return (
          <PublicationsForm
            depositConfigHandler={this.props.depositConfigHandler}
            libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
          />
        );

      case 3: // data step
        return (
          <DataForm
            depositConfigHandler={this.props.depositConfigHandler}
            libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
          />
        );

      case 4: // software
        return (
          <SoftwareForm
            depositConfigHandler={this.props.depositConfigHandler}
            libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
          />
        );
      case 5: // others
        return (
          <OthersForm
            depositConfigHandler={this.props.depositConfigHandler}
            libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
          />
        );

      default:
        return null;
    }
  }
}

export class KnowledgePackageDepositApp extends Component {
  sidebarRef = createRef();
  sidebarMenuRef = createRef();

  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      stepName: "general",
      knowledgePackageRecord: null,
    };

    this.depositConfigHandler = new DepositConfigHandler({
      record: props.record,
      files: props.files,
      config: props.config,
      permissions: props.permissions,
    });

    this.libraryVocabulariesHandler = new LibraryVocabularyHandler(
      props.config.vocabularies
    );

    this.stepNames = ["general", "publications", "data", "software", "others"];
  }

  stepHandler = (step) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        step: step,
        stepName: this.stepNames[step - 1],
      };
    });
  };

  render() {
    const { step, stepName } = this.state;

    let isKnowledgePackage = false;
    let isRecordPublished =
      this.depositConfigHandler.props.record.is_published === true;
    let resourceType = this.depositConfigHandler.props.record.metadata
      .resource_type;

    if (!_.isNil(resourceType)) {
      if (resourceType.title.en === KNOWLEDGE_PACKAGE) {
        isKnowledgePackage = true;
      }
    }

    if (isKnowledgePackage) {
      return (
        <GlobalDndContext>
          <Provider store={geoGlobalStore} context={geoGlobalContext}>
            <Container style={{ marginTop: "10px" }}>
              <DepositStep
                stepName={stepName}
                stepHandler={this.stepHandler}
                isRecordPublished={isRecordPublished}
              />

              <KnowledgePackageDepositSteps
                step={step}
                isRecordPublished={isRecordPublished}
                sidebarMenuRef={this.sidebarMenuRef}
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
          <KnowledgeResourceForm
            sidebarMenuRef={this.sidebarMenuRef}
            depositConfigHandler={this.depositConfigHandler}
            libraryVocabulariesHandler={this.libraryVocabulariesHandler}
          ></KnowledgeResourceForm>
        </Provider>
      );
    }
  }
}
