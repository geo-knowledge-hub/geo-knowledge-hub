/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useContext } from "react";

import _get from "lodash/get";

import { Button, Item, Icon, Label } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { SearchItemCreators } from "@invenio-app-rdm/utils";

import {
  extractProgrammeActivityAcronym,
  recordTypeLinksFactory,
} from "../../../../../utils";

import { PackageSearchContext } from "./context";

/**
 * Result Item component to present Package items.
 */
export const PackageSelectorListItem = ({ result, index }) => {
  // States
  const { selectedPackage, setSelectedPackage } =
    useContext(PackageSearchContext);

  // Extracting the information to be rendered in the component.
  const recordLinks = recordTypeLinksFactory(result.id, result.parent.type);

  const accessStatusId = _get(result, "ui.access_status.id", "open");
  const accessStatus = _get(result, "ui.access_status.title_l10n", "Open");
  const accessStatusIcon = _get(result, "ui.access_status.icon", "unlock");

  const createdDate = _get(
    result,
    "ui.created_date_l10n_long",
    i18next.t("No creation date found.")
  );

  const creators = _get(result, "ui.creators.creators", []).slice(0, 3);

  const publicationDate = _get(
    result,
    "ui.publication_date_l10n_long",
    i18next.t("No publication date found.")
  );

  const title = _get(result, "metadata.title", i18next.t("No title"));
  const version = _get(result, "ui.version", null);
  const isPublished = result.is_published;

  const programmeActivityAcronym = extractProgrammeActivityAcronym(
    _get(result, "metadata.geo_work_programme_activity.title.en")
  );

  const viewLink = isPublished
    ? recordLinks.published.ui
    : recordLinks.draft.ui;

  const isPackageSelected = selectedPackage?.id === result.id;

  return (
    <>
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
            {/* For reduced spacing between labels. */}
            {programmeActivityAcronym && (
              <Label size="tiny" className={"programme-activity-label"}>
                {programmeActivityAcronym}
              </Label>
            )}
            <Label size="tiny" className="primary">
              {publicationDate} ({version})
            </Label>
            <Label size="tiny" className={`access-status ${accessStatusId}`}>
              {accessStatusIcon && <i className={`icon ${accessStatusIcon}`} />}
              {accessStatus}
            </Label>
          </Item.Extra>
          <Item.Header as="h2">
            <a href={viewLink}>{title}</a>
          </Item.Header>
          <Item.Meta>
            <div className="creatibutors">
              <SearchItemCreators creators={creators} />
            </div>
          </Item.Meta>
          <Item.Extra>
            {createdDate && (
              <div>
                <small>
                  {i18next.t("Uploaded on")} <span>{createdDate}</span>
                </small>
              </div>
            )}
          </Item.Extra>
        </Item.Content>
        <Item.Extra className="flex width auto mt-0">
          <div className="align-self-center">
            <Button
              content={
                isPackageSelected ? i18next.t("Selected") : i18next.t("Select")
              }
              size="small"
              positive={isPackageSelected}
              onClick={() => setSelectedPackage(result)}
              aria-label={i18next.t("Select ") + result.metadata.title}
            />
          </div>
        </Item.Extra>
      </Item>
    </>
  );
};
