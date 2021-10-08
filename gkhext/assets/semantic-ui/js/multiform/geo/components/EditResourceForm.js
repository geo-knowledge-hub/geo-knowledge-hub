import React, { Fragment } from "react";

import _get from "lodash/get";
import _isEmpty from 'lodash/isEmpty';

import { BaseDepositForm } from "./BaseDepositForm";

import {
    DepositController
} from "react-invenio-deposit";

import { FullDepositForm } from "./FullDepositForm";

export class EditResourceForm extends BaseDepositForm {
  constructor(props) {
    super(props);
  }

  render() {
    // assuming that the resource is already published
    let resourceType = this.depositConfigHandler.props.record.metadata.resource_type.title.en;

    return (
      <FullDepositForm
        isRecordPublished={false}
        resourceType={resourceType}
        controller={DepositController} // default deposit controller
        contextInfo={this.props.contextInfo}
        depositConfigHandler={this.depositConfigHandler}
        libraryVocabulariesHandler={this.libraryVocabulariesHandler}
      >
      </FullDepositForm>
    )
  }
};
