/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";

import _get from "lodash/get";
import _truncate from "lodash/truncate";

import { Item, Label } from "semantic-ui-react";

import { SearchItemCreators } from "@invenio-app-rdm/utils";
import { i18next } from "@translations/invenio_app_rdm/i18next";

import {
  extractRecordBadge,
  extractProgrammeActivityAcronym,
  recordTypeLinksFactory,
} from "../utils";

export const CustomRecordResultsListItem = ({ result }) => {
  const recordBadge = extractRecordBadge(result.parent.type);

  const recordLinks = recordTypeLinksFactory(result.id, result.parent.type);

  const accessStatusId = _get(result, "ui.access_status.id", "open");
  const accessStatus = _get(result, "ui.access_status.title_l10n", "Open");
  const accessStatusIcon = _get(result, "ui.access_status.icon", "unlock");
  const createdDate = _get(
    result,
    "ui.created_date_l10n_long",
    "No creation date found."
  );
  const creators = result.ui.creators.creators.slice(0, 3);

  const descriptionStripped = _get(
    result,
    "ui.description_stripped",
    "No description"
  );

  const publicationDate = _get(
    result,
    "ui.publication_date_l10n_long",
    "No publication date found."
  );
  const resourceType = _get(
    result,
    "ui.resource_type.title_l10n",
    "No resource type"
  );
  const subjects = _get(result, "ui.subjects", []);
  const title = _get(result, "metadata.title", "No title");
  const version = _get(result, "ui.version", null);

  // preparing the GEO Work programme activity badge
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
            <Label size="tiny" color="programme-activity-label">
              {programmeActivityAcronym}
            </Label>
          )}
          <Label size="tiny" className="primary">
            {publicationDate} ({version})
          </Label>
          <Label size="tiny" className="neutral">
            {resourceType}
          </Label>
          {/*<Label size="tiny" className={`access-status ${accessStatusId}`}>*/}
          {/*  {accessStatusIcon && <i className={`icon ${accessStatusIcon}`} />}*/}
          {/*  {accessStatus}*/}
          {/*</Label>*/}
        </Item.Extra>
        <Item.Header as="h2">
          <a href={viewLink}>{title}</a>
        </Item.Header>
        <Item className="creatibutors">
          <SearchItemCreators creators={creators} />
        </Item>
        <Item.Description>
          {_truncate(descriptionStripped, { length: 350 })}
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

CustomRecordResultsListItem.propTypes = {
  result: PropTypes.object.isRequired,
};
