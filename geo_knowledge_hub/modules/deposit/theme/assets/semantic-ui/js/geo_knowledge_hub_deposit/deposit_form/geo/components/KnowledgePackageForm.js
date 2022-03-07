import React from "react";
import { connect } from "react-redux";

import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";

import { BaseDepositForm } from "./BaseDepositForm";
import { FullDepositForm } from "./FullDepositForm";

import { KNOWLEDGE_PACKAGE_ID } from "../resources/types";

import { geoGlobalContext } from "../../configStore";
import { ACTION_SAVE_KNOWLEDGE_PACKAGE } from "../state/types";

import { KnowledgePackageDepositController } from "../controllers/KnowledgePackageDepositController";

export class KnowledgePackageFormComponent extends BaseDepositForm {
  constructor(props) {
    super(props);
  }

  render() {
    // defining if the next is activated
    const isRecordPublished = this.depositConfigHandler.props.record.is_published === true;

    // defining the knowledge package on the redux store
    const { knowledgePackage, saveKnowledgePackage } = this.props;
    if (isRecordPublished && _isEmpty(knowledgePackage)) {
      saveKnowledgePackage(this.depositConfigHandler.props.record);
    }

    return (
      <FullDepositForm
        resourceType={KNOWLEDGE_PACKAGE_ID}
        contextInfo={this.props.contextInfo}
        isRecordPublished={isRecordPublished}
        controller={KnowledgePackageDepositController}
        depositConfigHandler={this.depositConfigHandler}
        libraryVocabulariesHandler={this.libraryVocabulariesHandler}
      >
      </FullDepositForm>
    )
  }
};

// redux store config
const mapStateToProps = (state) => ({
  knowledgePackage: state.knowledgePackage
});

const mapDispatchToProps = (dispatch) => ({
  saveKnowledgePackage: (knowledgePackage) =>
    dispatch({
      type: ACTION_SAVE_KNOWLEDGE_PACKAGE,
      payload: {
        knowledgePackage: knowledgePackage
      }
    }),
});

export const KnowledgePackageForm = connect(
  mapStateToProps, mapDispatchToProps, null, { context: geoGlobalContext }
)(KnowledgePackageFormComponent);
