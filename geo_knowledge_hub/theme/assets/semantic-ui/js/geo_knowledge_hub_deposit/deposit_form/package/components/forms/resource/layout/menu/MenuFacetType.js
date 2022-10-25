/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { connect, Provider } from "react-redux";

import _isNil from "lodash/isNil";
import _cloneDeep from "lodash/cloneDeep";

import {
  Grid,
  Dropdown,
  List,
  Icon,
  Header,
  Button,
  Segment,
  Image,
} from "semantic-ui-react";

import { withState } from "react-searchkit";

import { i18next } from "@translations/geo_knowledge_hub/i18next";

import {
  layoutResourcesOpenModal,
  layoutResourcesOpenModalSearch,
} from "../../../../../state/operations/layout";

import { OperationTypes } from "../../operations";

class MenuFacetTypeComponent extends Component {
  state = {
    selectedFacet: null,
  };

  constructor(props) {
    super(props);

    this.facetType = "base_type";
    this.facetComponents = [
      {
        title: i18next.t("Dataset"),
        icon: "database",
        baseTypeName: "dataset",
      },
      {
        title: i18next.t("Publication"),
        icon: "file alternate outline",
        baseTypeName: "publication",
      },
      {
        title: i18next.t("Software"),
        icon: "code",
        baseTypeName: "software",
      },
      {
        title: i18next.t("Others"),
        icon: "ellipsis horizontal",
        baseTypeName: "other",
      },
    ];
  }

  /**
   * Create facet filters based on user selected type.
   */
  createFacetFilter = (facetValue) => {
    const newState = _cloneDeep(this.props.currentQueryState);
    newState.filters = [this.facetType, facetValue];

    return newState;
  };

  /**
   * Update the selected type used to create the facet filter.
   */
  updateSelectedFacet = (resourceType) => {
    this.setState({ ...this.state, selectedFacet: resourceType }, () => {
      let newQueryState = [];

      if (resourceType !== null) {
        newQueryState = this.createFacetFilter(resourceType);
      }

      this.props.updateQueryState(newQueryState);
    });
  };

  /**
   * Check if the operation is valid for this component.
   */
  checkOperationIsValid = (operationMetadata) => {
    return (
      !_isNil(operationMetadata) &&
      operationMetadata.type === OperationTypes.MENU_FACET_TYPE_OPERATION_TYPE
    );
  };

  // Rendering!
  render() {
    // Props (Resource Modal)
    const {
      dispatchLayoutResourcesOpenModal,
      stateRecordTemplate,
      stateDepositConfigResource,
      stateDepositConfigResourceFiles,
      stateDepositOperationMetadata,
      stateDepositOperationInProgress,
      statePackageRecord,
    } = this.props;

    // Props (Search Resource modal)
    const { dispatchLayoutResourcesOpenModalSearch } = this.props;

    // Props (Operation identifier)
    let operationInProgress = null;
    const operationIsValid = this.checkOperationIsValid(
      stateDepositOperationMetadata
    );

    if (operationIsValid && stateDepositOperationInProgress) {
      operationInProgress = stateDepositOperationMetadata.id;
    }

    const isPackagePublished = statePackageRecord?.is_published;

    return (
      <Segment>
        <Grid stackable>
          <Grid.Row className={"highlight-background"}>
            <Grid.Column>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column width={12} verticalAlign="middle">
                    <Header as={"h4"}>{i18next.t("Resources")}</Header>
                  </Grid.Column>
                  <Grid.Column width={2} verticalAlign="middle">
                    <Icon name={"archive"} size={"large"} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <List selection verticalAlign="middle">
                {this.facetComponents.map((facetComponentProperties, index) => (
                  <List.Item
                    key={index}
                    active={
                      this.state.selectedFacet ===
                      facetComponentProperties.baseTypeName
                    }
                    onClick={() => {
                      let selectedFacet = null;

                      if (
                        this.state.selectedFacet !==
                        facetComponentProperties.baseTypeName
                      ) {
                        selectedFacet = facetComponentProperties.baseTypeName;
                      }

                      this.updateSelectedFacet(selectedFacet);
                    }}
                  >
                    <List.Content floated="right">
                      <Dropdown
                        icon={<></>}
                        trigger={
                          <Button
                            circular
                            icon
                            basic
                            size="tiny"
                            loading={
                              operationInProgress ===
                              facetComponentProperties.baseTypeName
                            }
                          >
                            <Icon name="add" />
                          </Button>
                        }
                        options={[
                          {
                            key: "create",
                            icon: "add",
                            text: i18next.t("Create a new resource"),
                            value: "create",
                            disabled: isPackagePublished,
                            onClick: () => {
                              if (!isPackagePublished) {
                                dispatchLayoutResourcesOpenModal({
                                  record: stateRecordTemplate,
                                  config: stateDepositConfigResource,
                                  files: stateDepositConfigResourceFiles,
                                  resourceType: {
                                    baseType:
                                      facetComponentProperties.baseTypeName,
                                    typeName: facetComponentProperties.title,
                                  },
                                });
                              }
                            },
                          },
                          {
                            key: "link",
                            icon: "linkify",
                            text: i18next.t("Attach an existing resource"),
                            value: "link",
                            disabled: isPackagePublished,
                            onClick: () => {
                              if (!isPackagePublished) {
                                dispatchLayoutResourcesOpenModalSearch({
                                  resourceType:
                                    facetComponentProperties.baseTypeName,
                                  resourceTypeName:
                                    facetComponentProperties.title,
                                });
                              }
                            },
                          },
                        ]}
                      />
                    </List.Content>
                    <Image avatar circular>
                      <Icon name={facetComponentProperties.icon} />
                    </Image>
                    <List.Content>
                      <List.Header>
                        {facetComponentProperties.title}
                      </List.Header>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  statePackageRecord: state.storage.packageObject.record,
  stateRecordTemplate: state.storage.depositConfig.templates.record,
  stateDepositConfigResource: state.storage.depositConfig.resource.record,
  stateDepositConfigResourceFiles: state.storage.depositConfig.resource.files,
  stateDepositOperationMetadata: state.deposit.depositOperationMetadata,
  stateDepositOperationInProgress: state.deposit.depositOperationInProgress,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLayoutResourcesOpenModal: (modalData) =>
    dispatch(layoutResourcesOpenModal(modalData)),
  dispatchLayoutResourcesOpenModalSearch: (baseType) =>
    dispatch(layoutResourcesOpenModalSearch(baseType)),
});

export const MenuFacetType = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuFacetTypeComponent);

export const MenuFacetTypeHOC = (store) => {
  const Component = ({ ...args }) => (
    <Provider store={store}>
      <MenuFacetType {...args} />
    </Provider>
  );

  return withState(Component);
};
