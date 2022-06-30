/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _ from "lodash";
import React from "react";

import {BaseDepositForm} from "./BaseDepositForm";

import {FullDepositForm} from "./FullDepositForm";
import {UniqueKnowledgeResourceDepositController} from "../controllers";

export class KnowledgeResourceForm extends BaseDepositForm {
  constructor(props) {
    super(props);
  }

  render() {
    // assuming that the resource is already published
    let resourceType = _.get(
      this.depositConfigHandler.props.record.metadata.resource_type,
      "id"
    );

    return (
      <FullDepositForm
        isRecordPublished={false}
        resourceType={resourceType}
        controller={UniqueKnowledgeResourceDepositController}
        sidebarMenuRef={this.props.sidebarMenuRef}
        isResourcePackage={true}
        depositConfigHandler={this.depositConfigHandler}
        libraryVocabulariesHandler={this.libraryVocabulariesHandler}
      ></FullDepositForm>
    );
  }
}
