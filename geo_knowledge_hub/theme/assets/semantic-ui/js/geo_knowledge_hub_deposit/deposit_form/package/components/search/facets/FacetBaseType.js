/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import _cloneDeep from "lodash/cloneDeep";

import { withState } from "react-searchkit";
import { Grid, List, Icon, Header, Button, Segment } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { ResourceFormContext } from "../../../context";

class FacetBaseTypeComponent extends Component {
  constructor(props) {
    super(props);
    // Required: Extracting the modal state
    this.modal = props.modal;

    // Required: Extracting facet used to get the resources from the GEO Knowledge Hub API.
    this.facetType = "base_type";

    // Defining the resource type facets components
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
        baseTypeName: "except",
      },
    ];

    this.selectedFacet = null;
  }

  buildFacetFilterState(facetValue) {
    const newState = _cloneDeep(this.props.currentQueryState);
    newState.filters = [this.facetType, facetValue];

    return newState;
  }

  render() {
    return (
      <>
        <Segment>
          <Grid stackable>
            <Grid.Row className={"highlight-background"}>
              <Grid.Column>
                <Grid stackable>
                  <Grid.Row>
                    <Grid.Column width={12}>
                      <Header as={"h4"}>Resource types</Header>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <Icon name={"archive"} size={"large"} />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={16}>
                <List selection verticalAlign="middle">
                  {this.facetComponents.map((facetComponent, index) => (
                    <List.Item
                      active={
                        this.selectedFacet === facetComponent.baseTypeName
                      }
                    >
                      <List.Content floated="right">
                        <Button
                          circular
                          icon
                          size={"tiny"}
                          onClick={() => {
                            this.modal.setState({
                              ...this.modal.modalState,
                              record: this.props.recordTemplate,
                              config: this.props,
                              open: true,
                              baseType: facetComponent.baseTypeName,
                            });
                          }}
                        >
                          <Icon name={"add"} />
                        </Button>
                      </List.Content>
                      <Icon name={facetComponent.icon} size={"large"} fitted />
                      <List.Content
                        onClick={() => {
                          // Case 1: Double click clean the selection
                          if (
                            this.selectedFacet === facetComponent.baseTypeName
                          ) {
                            this.selectedFacet = null;

                            this.props.updateQueryState([]);
                          } else {
                            // Case 2: One click enable the selection
                            this.selectedFacet = facetComponent.baseTypeName;

                            this.props.updateQueryState(
                              this.buildFacetFilterState(
                                facetComponent.baseTypeName
                              )
                            );
                          }
                        }}
                      >
                        <List.Header>{facetComponent.title}</List.Header>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </>
    );
  }
}

const FacetBaseTypeContextualized = ({ ...props }) => (
  <ResourceFormContext.Consumer>
    {(value) => <FacetBaseTypeComponent {...{ ...value, ...props }} />}
  </ResourceFormContext.Consumer>
);

export const FacetBaseType = withState(FacetBaseTypeContextualized);
