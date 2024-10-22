/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2021 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";

import { createSearchAppInit } from "@js/invenio_search_ui";
import {
  SearchAppFacets,
  SearchAppResultsPane,
} from "@js/invenio_search_ui/components";

import { parametrize, overrideStore } from "react-overridable";
import { GridResponsiveSidebarColumn } from "react-invenio-forms";

import { SearchBar } from "react-searchkit";
import { Button, Card, Container, Grid } from "semantic-ui-react";

import {
  ContribSearchAppFacets,
  ContribBucketAggregationValuesElement,
} from "@js/invenio_search_ui/components";

import { i18next } from "@translations/invenio_communities/i18next";

import {
  CommunitiesResults,
  CommunitiesSearchBarElement,
} from "@js/invenio_communities/community/search";
import { MobileCommunitiesItem } from "@js/invenio_communities/community/communities_items/MobileCommunitiesItem";
import { ComputerTabletCommunitiesItem } from "@js/invenio_communities/community/communities_items/ComputerTabletCommunitiesItem";

const appName = "InvenioCommunities.Search";

function ResultsGridItemTemplate({ result }) {
  return (
    <Card fluid href={`/communities/${result.slug}`}>
      <Card.Content>
        <Card.Header>{result.metadata.title}</Card.Header>
        <Card.Description>
          <div className="truncate-lines-2">{result.metadata.description}</div>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

ResultsGridItemTemplate.propTypes = {
  result: PropTypes.object.isRequired,
};

function ResultsItemTemplate({ result }) {
  return (
    <>
      <ComputerTabletCommunitiesItem result={result} />
      <MobileCommunitiesItem result={result} />
    </>
  );
}

ResultsItemTemplate.propTypes = {
  result: PropTypes.object.isRequired,
};

const RDMBucketAggregationElement = ({ title, containerCmp }) => {
  return (
    <Card className="borderless facet">
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        {containerCmp}
      </Card.Content>
    </Card>
  );
};

RDMBucketAggregationElement.propTypes = {
  title: PropTypes.string.isRequired,
  containerCmp: PropTypes.node.isRequired,
};

export const CommunitiesSearchLayout = (props) => {
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const { config } = props;
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column
            only="mobile tablet"
            mobile={2}
            tablet={1}
            verticalAlign="middle"
            className="mt-10"
          >
            <Button
              basic
              icon="sliders"
              onClick={() => setSidebarVisible(true)}
              aria-label={i18next.t("Filter results")}
            />
          </Grid.Column>
          <Grid.Column
            mobile={14}
            tablet={9}
            computer={12}
            floated="right"
            className="mt-10"
          >
            <SearchBar placeholder={i18next.t("Search communities...")} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <GridResponsiveSidebarColumn
            width={4}
            open={sidebarVisible}
            onHideClick={() => setSidebarVisible(false)}
            // eslint-disable-next-line react/no-children-prop
            children={<SearchAppFacets aggs={config.aggs} appName={appName} />}
          />
          <Grid.Column mobile={16} tablet={16} computer={12}>
            <SearchAppResultsPane
              layoutOptions={config.layoutOptions}
              appName={appName}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

CommunitiesSearchLayout.propTypes = {
  config: PropTypes.object.isRequired,
};

const ContribSearchAppFacetsWithConfig = parametrize(ContribSearchAppFacets, {
  help: false,
});

const defaultComponents = {
  [`${appName}.BucketAggregation.element`]: RDMBucketAggregationElement,
  [`${appName}.BucketAggregationValues.element`]:
    ContribBucketAggregationValuesElement,
  [`${appName}.SearchApp.facets`]: ContribSearchAppFacetsWithConfig,
  [`${appName}.ResultsList.item`]: ResultsItemTemplate,
  [`${appName}.ResultsGrid.item`]: ResultsGridItemTemplate,
  [`${appName}.SearchApp.layout`]: CommunitiesSearchLayout,
  [`${appName}.SearchBar.element`]: CommunitiesSearchBarElement,
  [`${appName}.SearchApp.results`]: CommunitiesResults,
};

const overriddenComponents = overrideStore.getAll();

// Auto-initialize search app
createSearchAppInit(
  { ...defaultComponents, ...overriddenComponents },
  true,
  "invenio-search-config",
  true
);
