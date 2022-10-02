/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import _get from "lodash/get";
import _truncate from "lodash/truncate";

import { Button, Icon, Item, Label, Modal, Message } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { axiosWithconfig, SearchItemCreators } from "@invenio-app-rdm/utils";

import { ResourceFormContext } from "../../../context";
import {
  extractProgrammeActivityAcronym,
  recordTypeLinksFactory,
} from "../../../../../../utils";

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

/**
 * (Base component) Result Item component for the Invenio Search UI `SearchApp`.
 * @constructor
 */
export const ResourceResultsListItemComponent = ({
  result,
  index,
  ...props
}) => {
  const [isConfirmModalOpen, setIsConformModalOpen] = useState(false);

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

  const descriptionStripped = _get(
    result,
    "ui.description_stripped",
    i18next.t("No description")
  );

  const publicationDate = _get(
    result,
    "ui.publication_date_l10n_long",
    i18next.t("No publication date found.")
  );
  const resourceType = _get(
    result,
    "ui.resource_type.title_l10n",
    i18next.t("No resource type")
  );
  const title = _get(result, "metadata.title", i18next.t("No title"));
  const subjects = _get(result, "ui.subjects", []);
  const version = _get(result, "ui.version", null);
  const isPublished = result.is_published;

  const programmeActivityAcronym = extractProgrammeActivityAcronym(
    _get(result, "metadata.geo_work_programme_activity.title.en")
  );

  // Derivatives
  const editRecord = () => {
    // Creating the deposit configuration for the selected object
    const resultDepositConfiguration = {
      configRecordDeposit: {
        ...props.config,
        apiUrl: result.links.draft,
      },
      files: result.files,
      modal: props.modal,
      search: props.search,
    };

    // Opening the modal
    const modalHandler = props.modal;

    modalHandler.setState({
      ...modalHandler.state,
      config: resultDepositConfiguration,
      // ToDo: Update the API to return the correct link!
      record: {
        ...result,
        links: {
          ...result.links,
          self: result.links.draft,
        },
      },
      open: true,
    });
  };

  const removeRecord = () => {
    setIsConformModalOpen(true);
  };

  const viewLink = isPublished
    ? recordLinks.published.ui
    : recordLinks.draft.ui;
  return (
    <>
      {isConfirmModalOpen && (
        <Modal
          open={isConfirmModalOpen}
          onClose={() => {
            setIsConformModalOpen(false);
          }}
          size="small"
          closeIcon
          closeOnDimmerClick={false}
        >
          <Modal.Header>
            {i18next.t("Are you sure you want to delete this record?")}
          </Modal.Header>
          {/* the modal text should only ever come from backend configuration */}
          <Modal.Content>
            <Message visible warning>
              <p>
                <Icon name="warning sign" />{" "}
                {i18next.t(
                  "Once the record is deleted, it will no longer be possible to recover it!\n"
                )}
              </p>
            </Message>
          </Modal.Content>
          <Modal.Actions>
            <Button
              floated="left"
              onClick={() => {
                setIsConformModalOpen(false);
              }}
            >
              {i18next.t("Cancel")}
            </Button>
            <Button
              onClick={(event) => {
                // Creating the exclusion link
                const exclusionLink = props.config.apiUrl;

                // ToDo: Check the package to make sure that the `record`
                //       is "managed"
                axiosWithconfig
                  .delete(exclusionLink, {
                    data: {
                      resources: [
                        {
                          id: result.id,
                          type: "managed",
                        },
                      ],
                    },
                  })
                  .then((res) => {
                    setTimeout(() => {
                      setIsConformModalOpen(false);
                    }, 200);

                    setTimeout(() => {
                      props.search.setState({ updateSearch: true });
                    }, 300);
                  });
              }}
              positive
            >
              {i18next.t("Confirm")}
            </Button>
          </Modal.Actions>
        </Modal>
      )}

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
            {result.status in RECORD_STATUS && result.status !== "published" && (
              <Label size="tiny" className={RECORD_STATUS[result.status].color}>
                {RECORD_STATUS[result.status].title}
              </Label>
            )}
            <Label size="tiny" className="primary">
              {publicationDate} ({version})
            </Label>
            <Label size="tiny" className="neutral">
              {resourceType}
            </Label>
            <Label size="tiny" className={`access-status ${accessStatusId}`}>
              {accessStatusIcon && <i className={`icon ${accessStatusIcon}`} />}
              {accessStatus}
            </Label>
            <Button
              compact
              size="small"
              color="red"
              floated="right"
              onClick={() => removeRecord()}
            >
              <Icon name="delete" />
              {i18next.t("Exclude")}
            </Button>
            <Button
              compact
              size="small"
              floated="right"
              onClick={() => editRecord()}
            >
              <Icon name="edit" />
              {i18next.t("Edit")}
            </Button>
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
    </>
  );
};

/**
 * Result Item component for the Invenio Search UI `SearchApp`.
 * @constructor
 */
export const ResourceResultsListItem = ({ result, index }) => (
  <ResourceFormContext.Consumer>
    {(value) => (
      <ResourceResultsListItemComponent {...{ ...value, result, index }} />
    )}
  </ResourceFormContext.Consumer>
);

ResourceResultsListItem.propTypes = {
  result: PropTypes.object.isRequired,
  index: PropTypes.string,
};

ResourceResultsListItem.defaultProps = {
  index: null,
};
