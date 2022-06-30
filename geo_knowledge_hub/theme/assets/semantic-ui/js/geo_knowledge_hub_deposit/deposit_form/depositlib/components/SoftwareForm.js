/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, {Fragment} from "react";

import {Container, Grid, Segment} from "semantic-ui-react";

import _cloneDeep from "lodash/cloneDeep";
import {OverridableContext} from "react-overridable";

import {CustomRecordResultsListItem} from "@geo-knowledge-hub-search/components";

import {SOFTWARE} from "../resources/types/index";

import {
  RelatedResources,
  RDMEmptyResults,
  RDMRecordSearchBarElement,
  RelatedResourcesSearchConfig
} from "./search";

import {BaseDepositForm} from "./BaseDepositForm";
import {KnowledgeResourceModalForm} from "./modals";

import {ElasticSearchQueryBuilder} from "../ElasticSearchQueryBuilder";


export class SoftwareForm extends BaseDepositForm {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.searchComponents = {
      "ResultsList.item": CustomRecordResultsListItem,
      "SearchBar.element": RDMRecordSearchBarElement,
      "EmptyResults.element": RDMEmptyResults,
    };

    this.vocabularyResourceTypes = this.libraryVocabulariesHandler.filterResourceByType(
      SOFTWARE
    );
  }

  modalWindowHandler = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isModalOpen: !prevState.isModalOpen,
      };
    });
  };

  render() {
    const relatedResourcesSearchConfig = _cloneDeep(
      RelatedResourcesSearchConfig
    );
    const relatedResourceQuery = ElasticSearchQueryBuilder.buildQueryByKnowledgePackageResource(
      this.depositConfigHandler.props.record.pids.doi.identifier,
      this.vocabularyResourceTypes
    );

    relatedResourcesSearchConfig["initialQueryState"] = {
      queryString: relatedResourceQuery,
    };

    return (
      <Fragment>
        <Container style={{marginTop: "2rem"}}>
          <Segment vertical>
            <Grid>
              <Grid.Row centered>
                <Grid.Column width={16}>
                  <OverridableContext.Provider value={this.searchComponents}>
                    <RelatedResources
                      searchConfig={relatedResourcesSearchConfig}
                      modalWindowHandler={this.modalWindowHandler}
                    />
                  </OverridableContext.Provider>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>

        <KnowledgeResourceModalForm
          modalName={"Software register"}
          isModalOpen={this.state.isModalOpen}
          modalWindowHandler={this.modalWindowHandler}
          depositConfigHandler={this.props.depositConfigHandler}
          vocabularyResourceTypes={this.vocabularyResourceTypes}
          libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
        />
      </Fragment>
    );
  }
}
