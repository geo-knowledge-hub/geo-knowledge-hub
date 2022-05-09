import _get from "lodash/get";

import { Container, Grid, Segment } from "semantic-ui-react";

import _cloneDeep from "lodash/cloneDeep";
import { OverridableContext } from "react-overridable";

import React, { Fragment } from "react";

import { BaseDepositForm } from "./BaseDepositForm";

import { KnowledgeResourceModalForm } from "./modals/KnowledgeResourceModalForm";

import { RDMEmptyResults } from "./search/RDMEmptyResults";
import { RelatedResources } from "./search/RelatedResources";
import { RelatedResourcesSearchConfig } from "./search/config";
import { ElasticSearchQueryBuilder } from "../ElasticSearchQueryBuilder";

import { RDMRecordSearchBarElement } from "./search/RDMRecordSearchBarElement";
import { RDMRecordResultsListItem } from "@invenio-app-rdm/search/components";

import {
  DATA,
  KNOWLEDGE_PACKAGE,
  PUBLICATIONS,
  SOFTWARE,
} from "../resources/types/index";

export class OthersForm extends BaseDepositForm {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.searchComponents = {
      "ResultsList.item": RDMRecordResultsListItem,
      "SearchBar.element": RDMRecordSearchBarElement,
      "EmptyResults.element": RDMEmptyResults,
    };

    this.vocabularyResourceTypes =
      this.libraryVocabulariesHandler.filterResourcesByInvalidTypes([
        DATA,
        SOFTWARE,
        PUBLICATIONS,
        // KNOWLEDGE_PACKAGE, (Temporary: To enable users to create a package of packages)
      ]);
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
    const relatedResourceQuery =
      ElasticSearchQueryBuilder.buildQueryByKnowledgePackageResource(
        this.depositConfigHandler.props.record.pids.doi.identifier,
        this.vocabularyResourceTypes
      );

    relatedResourcesSearchConfig["initialQueryState"] = {
      queryString: relatedResourceQuery,
    };

    return (
      <Fragment>
        <Container style={{ marginTop: "2rem" }}>
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
          modalName={"Others resources register"}
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
