import _get from "lodash/get";
import React, { Fragment } from "react";

import {
  Container,
  Grid,
  Segment
} from "semantic-ui-react";

import _cloneDeep from 'lodash/cloneDeep';
import { OverridableContext } from 'react-overridable';

import { BaseDepositForm } from "./BaseDepositForm";
import { DepositFormStepButton } from "./DepositFormStepButton";

import { PUBLICATIONS } from "../resources/types/index";
import { BaseModalForm } from "./modals/BaseModalForm";

import { RelatedResources } from "./search/RelatedResources";
import { RDMEmptyResults } from "./search/RDMEmptyResults";
import { RDMRecordResultsListItem } from "./search/RDMRecordResultsListItem";
import { RDMRecordSearchBarElement } from "./search/RDMRecordSearchBarElement";
import { RelatedResourcesSearchConfig } from "./search/config";
import { ElasticSearchQueryBuilder } from "../ElasticSearchQueryBuilder";

export class PublicationsForm extends BaseDepositForm {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.searchComponents = {
      "ResultsList.item": RDMRecordResultsListItem,
      "SearchBar.element": RDMRecordSearchBarElement,
      "EmptyResults.element": RDMEmptyResults,
    };

    this.vocabularyResourceTypes = this.libraryVocabulariesHandler.filterResourceByType(PUBLICATIONS);
  }

  modalWindowHandler = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isModalOpen: !prevState.isModalOpen
      }
    })
  }

  render() {
    const relatedResourcesSearchConfig = _cloneDeep(RelatedResourcesSearchConfig);
    const relatedResourceQuery = ElasticSearchQueryBuilder.buildQueryByKnowledgePackageResource(
      this.depositConfigHandler.props.record.pids.doi.identifier,
      this.vocabularyResourceTypes
    );

    relatedResourcesSearchConfig["initialQueryState"] = {
      queryString: relatedResourceQuery
    };

    return (
      <Fragment>

        <Container style={{ marginTop: "2rem", }}>
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

        <BaseModalForm
          modalName={"Publication register"}
          isModalOpen={this.state.isModalOpen}
          modalWindowHandler={this.modalWindowHandler}
          depositConfigHandler={this.props.depositConfigHandler}
          vocabularyResourceTypes={this.vocabularyResourceTypes}
          libraryVocabulariesHandler={this.props.libraryVocabulariesHandler}
        />

        <Segment vertical align="center">
          <DepositFormStepButton
            isNextActivated={true}
            isPreviousActivated={true}
            next={this.props.contextInfo.stepHandler.next}
            previous={this.props.contextInfo.stepHandler.previous}
          />
        </Segment>
      </Fragment>
    )
  }
};
