/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { connect, Provider } from "react-redux";

import {
  Grid,
  List,
  Icon,
  Header,
  Button,
  Segment,
  Image,
  Popup,
} from "semantic-ui-react";

import { i18next } from "@translations/geo_knowledge_hub/i18next";

import { layoutResourcesOpenModalManagementPermissions } from "../../../../../state/operations/layout";

class MenuManagementComponent extends Component {
  render() {
    // Props (Deposit operation)
    const { dispatchLayoutResourcesOpenModalManagementPermissions } =
      this.props;

    return (
      <Segment>
        <Grid stackable>
          <Grid.Row className={"highlight-background"}>
            <Grid.Column>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column verticalAlign={"middle"}>
                    <Header as={"h4"}>{i18next.t("Management")}</Header>
                  </Grid.Column>
                  <Grid.Column verticalAlign="right">
                    <Icon name={"cogs"} size={"large"} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16}>
              <List divided verticalAlign="middle">
                <List.Item>
                  <List.Content floated="right">
                    <Button
                      basic
                      compact
                      size="small"
                      onClick={() => {
                        dispatchLayoutResourcesOpenModalManagementPermissions();
                      }}
                    >
                      View
                    </Button>
                  </List.Content>
                  <Image avatar circular>
                    <Icon name="key" />
                  </Image>
                  <List.Content>
                    <Popup
                      content={i18next.t(
                        "Visualize and manage the permissions used in the resources of the package.",
                      )}
                      trigger={<span>Permissions</span>}
                    />
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchLayoutResourcesOpenModalManagementPermissions: () =>
    dispatch(layoutResourcesOpenModalManagementPermissions()),
});

export const MenuManagement = connect(
  null,
  mapDispatchToProps,
)(MenuManagementComponent);

export const MenuManagementHOC = (store) => {
  return ({ ...args }) => (
    <Provider store={store}>
      <MenuManagement {...args} />
    </Provider>
  );
};
