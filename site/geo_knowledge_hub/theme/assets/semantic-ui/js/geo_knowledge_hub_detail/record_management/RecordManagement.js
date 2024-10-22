/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { NewVersionButton } from "react-invenio-deposit";
import { Button, Grid, Icon, Message } from "semantic-ui-react";

import { EditButton, ShareButton, RequestButton } from "./components";

/**
 * Record management component.
 *
 * @note This component was adapted from Invenio App RDM to support
 *       Packages and Resources.
 */
export const RecordManagement = ({
  record,
  permissions,
  isDraft,
  isPreviewSubmissionRequest,
  showShare,
  assistanceRequests,
}) => {
  const { id: recid } = record;
  const [error, setError] = useState("");
  const handleError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  return (
    <Grid columns={1} className="record-management">
      {permissions.can_edit && !isDraft && (
        <Grid.Column className="pb-5">
          <EditButton record={record} onError={handleError} />
        </Grid.Column>
      )}
      {isPreviewSubmissionRequest && isDraft && (
        <Grid.Column>
          <Button
            fluid
            className="warning"
            size="medium"
            onClick={() =>
              (window.location = record.links.self_html || record.links.draft)
            }
            icon
            labelPosition="left"
          >
            <Icon name="edit" />
            {i18next.t("Edit")}
          </Button>
        </Grid.Column>
      )}
      {!isPreviewSubmissionRequest && (
        <>
          <Grid.Column className="pt-5 pb-5">
            <NewVersionButton
              fluid
              size="medium"
              record={record}
              onError={handleError}
              disabled={!permissions.can_new_version}
            />
          </Grid.Column>

          {(permissions.can_manage && showShare) && (
            <Grid.Column className="pt-5 pb-5">
              <ShareButton
                disabled={!permissions.can_update_draft}
                record={record}
              />
            </Grid.Column>
          )}

          <Grid.Column className="pt-5">
            {permissions.can_request_feed && (
              <RequestButton
                disabled={false}
                record={record}
                assistanceRequests={assistanceRequests}
              />
            )}
          </Grid.Column>
        </>
      )}
      {error && (
        <Grid.Row className="record-management">
          <Grid.Column>
            <Message negative>{error}</Message>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

RecordManagement.propTypes = {
  record: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  isDraft: PropTypes.bool.isRequired,
  isPreviewSubmissionRequest: PropTypes.bool.isRequired,
};
