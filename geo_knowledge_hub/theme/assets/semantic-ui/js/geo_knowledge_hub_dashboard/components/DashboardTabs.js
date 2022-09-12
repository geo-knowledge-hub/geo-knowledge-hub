/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import _map from "lodash/map";
import _camelCase from "lodash/camelCase";

import { SearchApp } from "@js/invenio_search_ui/components";
import { i18next } from "@translations/invenio_app_rdm/i18next";

import { overrideStore } from "react-overridable";
import { Container, Tab, Menu } from "semantic-ui-react";

import { CustomRecordResultsListItem } from "./CustomRecordResultsListItem";

import { defaultComponents as CommunitiesDefaultComponents } from "@invenio-app-rdm/user_dashboard/communities";
import { defaultComponents as UploadsDefaultComponents } from "@invenio-app-rdm/user_dashboard/uploads";
import { defaultComponents as RequestsDefaultComponents } from "@invenio-app-rdm/user_dashboard/requests";

/**
 * Constants
 */
const TAB_PANES = [
  {
    configDataAttribute: "invenio-search-user-uploads-config",
    label: i18next.t("Uploads"),
    pathname: "uploads",
  },
  {
    configDataAttribute: "invenio-search-user-communities-config",
    label: i18next.t("Communities"),
    pathname: "communities",
  },
  {
    configDataAttribute: "invenio-search-user-requests-config",
    label: i18next.t("Requests"),
    pathname: "requests",
  },
];

/**
 * Configurations
 */

// 1. Customizing the uploads defaults components
UploadsDefaultComponents["user-uploads-search.ResultsList.item"] =
  CustomRecordResultsListItem;

// 2. Creating the dashboard interface
// Code adapted from invenio-app-rdm package (v8.0)
const rootElement = document.getElementById("invenio-user-dashboard");

/**
 * Auxiliary functions
 */

/**
 * Retrieve data from HTML elements via `data-attribute`.
 * @param {object} element HTML element
 * @param {string} attr Attribute name to extract from the `data-attribute`.
 * @returns
 */
const getConfigFromDataAttribute = (element, attr) => {
  const dataValue = rootElement.dataset[attr];
  return JSON.parse(dataValue);
};

/**
 * Replace the current URL.
 */
const replaceURLPathname = (newPathname) =>
  window.history.replaceState({}, "", `/me/${newPathname}`);

/**
 * Dashboard tabs component.
 */
export class DashboardTabs extends Component {
  constructor(props) {
    super(props);
    const activeTabName = getConfigFromDataAttribute(
      rootElement,
      _camelCase("active-tab-name")
    );
    const communitiesEnabled = getConfigFromDataAttribute(
      rootElement,
      _camelCase("communities-enabled")
    );

    this.ACTIVE_TAB_PANES = communitiesEnabled ? TAB_PANES : [TAB_PANES[0]];

    const routes = this.ACTIVE_TAB_PANES.map((pane) => pane.pathname);
    this.state = {
      defaultActiveTab: routes.indexOf(activeTabName),
    };

    // replace URL with the first pathname when not defined
    if (window.location.pathname.endsWith("/" + activeTabName) === false) {
      replaceURLPathname(activeTabName);
    }

    for (const [componentId, component] of Object.entries({
      ...UploadsDefaultComponents,
      ...CommunitiesDefaultComponents,
      ...RequestsDefaultComponents,
    })) {
      overrideStore.add(componentId, component);
    }

    this.panes = this.ACTIVE_TAB_PANES.map((pane, index) => {
      const { appId, ...config } = getConfigFromDataAttribute(
        rootElement,
        _camelCase(pane.configDataAttribute)
      );
      return {
        menuItem: (
          <Menu.Item key={index} className="selected-menu-tab">
            {pane.label}
          </Menu.Item>
        ),
        render: () => (
          <Container>
            <Tab.Pane>
              <SearchApp appName={appId} key={appId} config={config} />
            </Tab.Pane>
          </Container>
        ),
      };
    });
  }

  onTabChange = (e, data) => {
    const activePane = this.ACTIVE_TAB_PANES[data.activeIndex];
    replaceURLPathname(activePane.pathname);
  };

  render() {
    const Element = Tab;

    // apply custom menu rendering
    Element.prototype.renderMenu = renderMenuCustom;

    return (
      <Container fluid>
        <Element
          id="dashboard-tab"
          defaultActiveIndex={this.state.defaultActiveTab}
          panes={this.panes}
          menu={{ secondary: true, pointing: true }}
          onTabChange={this.onTabChange}
          renderActiveOnly={true}
        />
      </Container>
    );
  }
}

function renderMenuCustom() {
  const { menu, panes, menuPosition } = this.props;
  const { activeIndex } = this.state;

  if (menu.tabular === true && menuPosition === "right") {
    menu.tabular = "right";
  }

  return (
    <Container fluid id="dashboard-tab-menu-container">
      <Container>
        {Menu.create(menu, {
          autoGenerateKey: false,
          overrideProps: {
            items: _map(panes, "menuItem"),
            onItemClick: this.handleItemClick,
            activeIndex,
          },
        })}
      </Container>
    </Container>
  );
}
