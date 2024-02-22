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

import { i18next } from "@translations/invenio_communities/i18next";
import { SearchItemCreators } from "@js/invenio_communities/details_search/components";

import { Item, Label } from "semantic-ui-react";

import {
  extractRecordBadge,
  extractProgrammeActivityAcronym,
  recordTypeLinksFactory,
} from "../utils";

/**
 * `CommunityRecordResultsListItem` adapted from Invenio Communities.
 */
export const CommunityRecordResultsListItem = ({ result }) => {
  const recordBadge = extractRecordBadge(result.parent.type);
  const recordLinks = recordTypeLinksFactory(result.id, result.parent.type);

  const access_status_id = _get(result, "ui.access_status.id", "open");
  const access_status = _get(result, "ui.access_status.title_l10n", "Open");
  const access_status_icon = _get(result, "ui.access_status.icon", "unlock");
  const createdDate = _get(
    result,
    "ui.created_date_l10n_long",
    "No creation date found."
  );
  const creators = result.ui.creators.creators.slice(0, 3);

  const description_stripped = _get(
    result,
    "ui.description_stripped",
    "No description"
  );

  const publicationDate = _get(
    result,
    "ui.publication_date_l10n_long",
    "No publication date found."
  );
  const resource_type = _get(
    result,
    "ui.resource_type.title_l10n",
    "No resource type"
  );
  const subjects = _get(result, "ui.subjects", []);
  const title = _get(result, "metadata.title", "No title");
  const version = _get(result, "ui.version", null);

  const programmeActivityAcronym = extractProgrammeActivityAcronym(
    _get(result, "metadata.geo_work_programme_activity.title.en")
  );

  // Derivatives
  const viewLink = recordLinks.published.ui;
  return (
    <Item>
      <Item.Content>
        <Item.Extra className="labels-actions">
          <Label size="tiny" color={recordBadge.color}>
            <i className={`icon ${recordBadge.icon}`}></i>{recordBadge.name}
          </Label>
          {programmeActivityAcronym && (
            <Label size="tiny" className={"programme-activity-label"}>
              {programmeActivityAcronym}
            </Label>
          )}
          <Label size="tiny" className="primary">
            {publicationDate} ({version})
          </Label>
          <Label size="tiny" className="neutral">
            {resource_type}
          </Label>
          {/*<Label size="tiny" className={`access-status ${access_status_id}`}>*/}
          {/*  {access_status_icon && (*/}
          {/*    <i className={`icon ${access_status_icon}`} />*/}
          {/*  )}*/}
          {/*  {access_status}*/}
          {/*</Label>*/}
        </Item.Extra>
        <Item.Header as="h2">
          <a href={viewLink}>{title}</a>
        </Item.Header>
        <Item className="creatibutors">
          <SearchItemCreators creators={creators} />
        </Item>
        <Item.Description>
          {_truncate(description_stripped, { length: 350 })}
        </Item.Description>
        <Item.Extra>
          {subjects.map((subject, index) => (
            <Label key={index} size="tiny">
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
