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
import _camelCase from "lodash/camelCase";

import { Button, Icon, Item, Label } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { extractProgrammeActivityAcronym } from "../../utils";
import { axiosWithconfig, SearchItemCreators } from "@invenio-app-rdm/utils";

import { DeleteDraftButton } from "./DeleteDraftButton";

export const CustomRecordResultsListItem = ({ result, index }) => {
  const access_status_id = _get(result, "ui.access_status.id", "open");
  const access_status = _get(result, "ui.access_status.title_l10n", "Open");
  const access_status_icon = _get(result, "ui.access_status.icon", "unlock");
  const createdDate = _get(
    result,
    "ui.created_date_l10n_long",
    i18next.t("No creation date found.")
  );
  const creators = _get(result, "ui.creators.creators", []).slice(0, 3);

  const description_stripped = _get(
    result,
    "ui.description_stripped",
    i18next.t("No description")
  );

  const publicationDate = _get(
    result,
    "ui.publication_date_l10n_long",
    i18next.t("No publication date found.")
  );
  const resource_type = _get(
    result,
    "ui.resource_type.title_l10n",
    i18next.t("No resource type")
  );

  const title = _get(result, "metadata.title", i18next.t("No title"));
  const subjects = _get(result, "ui.subjects", []);
  const version = _get(result, "ui.version", null);
  const is_published = result.is_published;

  const programme_activity_acronym = extractProgrammeActivityAcronym(
    _get(result, "metadata.geo_work_programme_activity.title.en")
  );

  // Derivatives
  const editRecord = () => {
    axiosWithconfig
      .post(`/api/records/${result.id}/draft`)
      .then((response) => {
        window.location = `/uploads/${result.id}`;
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const viewLink = is_published
    ? `/records/${result.id}`
    : `/uploads/${result.id}`;
  return (
    <Item key={index} className="deposits-list-item">
      <div className="status-icon">
        <Item.Content verticalAlign="top">
          <Item.Extra>
            {is_published ? (
              <Icon name="check" color="green" />
            ) : (
              <Icon name="upload" color="red" />
            )}
          </Item.Extra>
        </Item.Content>
      </div>
      <Item.Content style={{ cursor: "default" }}>
        <Item.Extra className="labels-actions">
          {/* For reduced spacing between labels. */}

          {programme_activity_acronym && (
            <Label size="tiny" color="teal">
              {programme_activity_acronym}
            </Label>
          )}
          <Label size="tiny" color="blue">
            {publicationDate} ({version})
          </Label>
          <Label size="tiny" color="grey">
            {resource_type}
          </Label>
          <Label size="tiny" className={`access-status ${access_status_id}`}>
            {access_status_icon && (
              <i className={`icon ${access_status_icon}`}></i>
            )}
            {access_status}
          </Label>
          <Button
            compact
            size="small"
            floated="right"
            onClick={() => editRecord()}
          >
            <Icon name="edit" />
            {i18next.t("Edit")}
          </Button>
          {is_published ? (
            <Button compact size="small" floated="right" href={viewLink}>
              <Icon name="eye" />
              {i18next.t("View")}
            </Button>
          ) : (
            <DeleteDraftButton record={result} />
          )}
        </Item.Extra>
        <Item.Header as="h2">
          <a href={viewLink}>{title}</a>
        </Item.Header>
        <Item.Meta className="creatibutors">
          <SearchItemCreators creators={creators} />
        </Item.Meta>
        <Item.Description>
          {_truncate(description_stripped, {
            length: 350,
          })}
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
