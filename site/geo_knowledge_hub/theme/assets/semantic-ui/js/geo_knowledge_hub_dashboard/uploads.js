/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";

import _get from "lodash/get";
import _truncate from "lodash/truncate";
import PropTypes from "prop-types";

import {
  Button,
  Header,
  Icon,
  Item,
  Label,
  Segment,
  Dropdown,
  Grid,
} from "semantic-ui-react";

import { Trans } from "react-i18next";

import { http } from "react-invenio-forms";
import { parametrize } from "react-overridable";

import { SearchBar } from "react-searchkit";
import { GridResponsiveSidebarColumn } from "react-invenio-forms";

import {
  SearchAppFacets,
  SearchAppResultsPane,
  ContribSearchAppFacets,
  ContribBucketAggregationElement,
  ContribBucketAggregationValuesElement,
} from "@js/invenio_search_ui/components";

import {
  RDMCountComponent,
  RDMEmptyResults as RDMNoSearchResults,
  RDMRecordSearchBarElement,
  RDMToggleComponent,
} from "@invenio-app-rdm/search/components";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { SearchItemCreators } from "@invenio-app-rdm/utils";

import { DashboardResultView } from "@invenio-app-rdm/user_dashboard/base";
import { createSearchAppInit } from "@js/invenio_search_ui";

import {
  extractRecordBadge,
  extractProgrammeActivityAcronym,
  recordTypeLinksFactory,
} from "../utils";

const RECORD_STATUS = {
  in_review: { color: "warning", title: i18next.t("In review") },
  declined: { color: "negative", title: i18next.t("Declined") },
  expired: { color: "expired", title: i18next.t("Expired") },
  draft_with_review: { color: "neutral", title: i18next.t("Draft") },
  draft: { color: "neutral", title: i18next.t("Draft") },
  new_version_draft: {
    color: "neutral",
    title: i18next.t("New version draft"),
  },
};

const ContribSearchAppFacetsWithConfig = parametrize(ContribSearchAppFacets, {
  toogle: true,
});

/**
 * `RDMRecordResultsListItem` component adapted from Invenio App RDM.
 */
export const RDMRecordResultsListItem = ({ result, index }) => {
  const recordBadge = extractRecordBadge(result.parent.type);
  const recordLinks = recordTypeLinksFactory(result.id, result.parent.type);

  const accessStatusId = _get(result, "ui.access_status.id", "open");
  const accessStatus = _get(result, "ui.access_status.title_l10n", "Open");
  const accessStatusIcon = _get(result, "ui.access_status.icon", "unlock");
  const createdDate = _get(
    result,
    "ui.created_date_l10n_long",
    i18next.t("No creation date found."),
  );
  const creators = _get(result, "ui.creators.creators", []).slice(0, 3);

  const descriptionStripped = _get(
    result,
    "ui.description_stripped",
    i18next.t("No description"),
  );

  const publicationDate = _get(
    result,
    "ui.publication_date_l10n_long",
    i18next.t("No publication date found."),
  );
  const resourceType = _get(
    result,
    "ui.resource_type.title_l10n",
    i18next.t("No resource type"),
  );
  const title = _get(result, "metadata.title", i18next.t("No title"));
  const subjects = _get(result, "ui.subjects", []);
  const version = _get(result, "ui.version", null);
  const isPublished = result.is_published;

  const programmeActivityAcronym = extractProgrammeActivityAcronym(
    _get(result, "metadata.geo_work_programme_activity.title.en"),
  );

  const isPackage = _get(result, "parent.type", null) === "package";
  const packageDashboard = `/packages/${result.id}/dashboard`;

  // Derivatives
  const editRecord = () => {
    http
      .post(recordLinks.draft.api)
      .then(() => {
        window.location = recordLinks.draft.ui;
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const viewLink = isPublished
    ? recordLinks.published.ui
    : recordLinks.draft.ui;

  return (
    <Item key={index} className="deposits-list-item mb-20">
      <div className="status-icon mr-10">
        <Item.Content verticalAlign="top">
          <Item.Extra>
            {isPublished ? (
              <Icon name="check" className="positive" />
            ) : (
              <Icon name="upload" className="negative" />
            )}
          </Item.Extra>
        </Item.Content>
      </div>
      <Item.Content style={{ cursor: "default" }}>
        <Item.Extra className="labels-actions">
          <Label size="tiny" color={recordBadge.color}>
            <i className={`icon ${recordBadge.icon}`}></i>
            {recordBadge.name}
          </Label>
          <Label size="tiny" color={"gray"}>
            {publicationDate} ({version})
          </Label>
          <Label size="tiny" color={"gray"}>
            {resourceType}
          </Label>
          {programmeActivityAcronym && (
            <Label size="tiny" color={"gray"}>
              {programmeActivityAcronym}
            </Label>
          )}
          {result.status in RECORD_STATUS && result.status !== "published" && (
            <Label size="tiny" className={RECORD_STATUS[result.status].color}>
              {RECORD_STATUS[result.status].title}
            </Label>
          )}
          {accessStatusId === "restricted" && (
            <Label size="tiny" className={`access-status ${accessStatusId}`}>
              {accessStatusIcon && <i className={`icon ${accessStatusIcon}`} />}
              {accessStatus}
            </Label>
          )}
          {isPackage && (
            <Button
              compact
              size="small"
              floated="right"
              href={packageDashboard}
            >
              <Icon name="dashboard" />
              {i18next.t("Dashboard")}
            </Button>
          )}
          <Button
            compact
            size="small"
            floated="right"
            onClick={() => editRecord()}
          >
            <Icon name="edit" />
            {i18next.t("Edit")}
          </Button>
          {isPublished && (
            <Button compact size="small" floated="right" href={viewLink}>
              <Icon name="eye" />
              {i18next.t("View")}
            </Button>
          )}
        </Item.Extra>
        <Item.Header as="h2">
          <a href={viewLink}>{title}</a>
        </Item.Header>
        <Item.Meta>
          <div className="creatibutors">
            <SearchItemCreators creators={creators} />
          </div>
        </Item.Meta>
        <Item.Description>
          {_truncate(descriptionStripped, {
            length: 350,
          })}
        </Item.Description>
        <Item.Extra>
          {subjects.map((subject) => (
            <Label key={subject.title_l10n} size="tiny">
              {subject.title_l10n}
            </Label>
          ))}
          {createdDate && (
            <div>
              <small>
                {i18next.t("Uploaded on")} <span>{createdDate}</span>
              </small>
            </div>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

RDMRecordResultsListItem.propTypes = {
  result: PropTypes.object.isRequired,
  index: PropTypes.string,
};

RDMRecordResultsListItem.defaultProps = {
  index: null,
};

export const RDMEmptyResults = (props) => {
  const { queryString } = props;
  const recordTypes = [
    {
      key: 1,
      text: (
        <p>
          Knowledge <b>Package</b>
        </p>
      ),
      value: 1,
      as: "a",
      href: "/uploads/packages/new",
    },
    {
      key: 2,
      text: (
        <p>
          Knowledge <b>Resource</b>
        </p>
      ),
      value: 2,
      as: "a",
      href: "/uploads/new",
    },
    {
      key: 3,
      text: (
        <p>
          Marketplace <b>Item</b>
        </p>
      ),
      value: 3,
      as: "a",
      href: "/uploads/marketplace/items/new",
    },
  ];

  return queryString === "" ? (
    <Segment.Group>
      <Segment placeholder textAlign="center" padded="very">
        <Header as="h1" align="center">
          <Header.Content>
            {i18next.t("You do not have any records yet")}
          </Header.Content>
        </Header>
        <div>
          <Trans>
            Click{" "}
            <Dropdown
              className={"selector"}
              text="here"
              as="a"
              icon={false}
              options={recordTypes}
            />{" "}
            to create your first record
          </Trans>
        </div>
      </Segment>
    </Segment.Group>
  ) : (
    <Segment padded="very">
      <RDMNoSearchResults {...props} searchPath="/me/uploads" />
    </Segment>
  );
};

RDMEmptyResults.propTypes = {
  queryString: PropTypes.string.isRequired,
};

const DashboardUploadsSearchLayout = (props) => {
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const { config } = props;

  return (
    <Grid>
      <Grid.Column only="mobile tablet" mobile={2} tablet={1}>
        <Button
          basic
          icon="sliders"
          onClick={() => setSidebarVisible(true)}
          aria-label={i18next.t("Filter results")}
        />
      </Grid.Column>

      <Grid.Column mobile={14} tablet={14} computer={12} floated="right">
        <SearchBar placeholder={i18next.t("Search your uploads")} />
      </Grid.Column>

      <Grid.Row>
        <GridResponsiveSidebarColumn
          width={4}
          open={sidebarVisible}
          onHideClick={() => setSidebarVisible(false)}
        >
          <SearchAppFacets aggs={config.aggs} appName={undefined} />
        </GridResponsiveSidebarColumn>
        <Grid.Column mobile={16} tablet={16} computer={12}>
          <SearchAppResultsPane
            layoutOptions={config.layoutOptions}
            appName={undefined}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const defaultComponents = {
  "BucketAggregation.element": ContribBucketAggregationElement,
  "BucketAggregationValues.element": ContribBucketAggregationValuesElement,
  "Count.element": RDMCountComponent,
  "EmptyResults.element": RDMEmptyResults,
  "ResultsList.item": RDMRecordResultsListItem,
  "SearchApp.facets": ContribSearchAppFacetsWithConfig,
  "SearchApp.layout": DashboardUploadsSearchLayout,
  "SearchApp.results": DashboardResultView,
  "SearchBar.element": RDMRecordSearchBarElement,
  "SearchFilters.Toggle.element": RDMToggleComponent,
};

createSearchAppInit(defaultComponents);
