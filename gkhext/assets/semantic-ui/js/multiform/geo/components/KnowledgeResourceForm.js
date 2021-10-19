import _ from 'lodash'
import React from "react";

import _get from "lodash/get";
import _isEmpty from 'lodash/isEmpty';

import { BaseDepositForm } from "./BaseDepositForm";

import { FullDepositForm } from "./FullDepositForm";
import { UniqueKnowledgeResourceDepositController } from '../controllers/UniqueKnowledgeResourceDepositController';

export class KnowledgeResourceForm extends BaseDepositForm {
  constructor(props) {
    super(props);
  }

  render() {
    // assuming that the resource is already published
    let resourceType = _.get(this.depositConfigHandler.props.record.metadata.resource_type, "id");

    return (
      <FullDepositForm
        isRecordPublished={false}
        resourceType={resourceType}
        controller={UniqueKnowledgeResourceDepositController}
        contextInfo={this.props.contextInfo}
        isResourcePackage={true}
        depositConfigHandler={this.depositConfigHandler}
        libraryVocabulariesHandler={this.libraryVocabulariesHandler}
      >
      </FullDepositForm>
    )
  }
};
