/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";

import _isEmpty from "lodash/isEmpty";

import { DateTime } from "luxon";

import { TextAreaField } from "react-invenio-forms";
import { Icon, Grid, Header } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import {
  EmbargoCheckboxField,
  EmbargoDateField,
} from "@geo-knowledge-hub/geo-deposit-react";

/**
 * Embargo Access component.
 *
 * @note This component is based on `EmbargoAccess` available
 *       on React Invenio Deposit.
 */
export const EmbargoAccess = ({
  access,
  communityAccess,
  packageAccess,
  isMetadataOnly,
  disabled,
}) => {
  const recordPublic = access.record === "public";
  const filesPublic = access.files === "public";
  const communityPublic = communityAccess === "public";
  const packagePublic = packageAccess === "public";

  const filesRestricted = !isMetadataOnly && !filesPublic;

  const embargoActive = access.embargo?.active || false;
  const embargoUntil = access.embargo?.until;
  const embargoReason = access.embargo?.reason;
  const embargoWasLifted = !embargoActive && !_isEmpty(embargoUntil);
  const embargoEnabled =
    packagePublic && communityPublic && (!recordPublic || filesRestricted);

  const fmtDate = embargoUntil
    ? DateTime.fromISO(embargoUntil).toLocaleString(DateTime.DATE_FULL)
    : "???";

  return (
    <>
      <Grid>
        <Grid.Row fluid>
          <Grid.Column width={2}>
            <EmbargoCheckboxField
              fieldPath="access.embargo.active"
              checked={embargoActive}
              disabled={disabled || !embargoEnabled}
            />
          </Grid.Column>
          <Grid.Column width={14}>
            <div>
              <Header as={"h5"}>
                {i18next.t("Apply an embargo")} <Icon name="clock outline" />
              </Header>
            </div>

            <div>
              Record or files protection must be <b>restricted</b> to apply an
              embargo.
            </div>
          </Grid.Column>
        </Grid.Row>

        {embargoActive && (
          <>
            <Grid.Row fluid>
              <Grid.Column width={16} centered>
                <EmbargoDateField fieldPath="access.embargo.until" required />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row fluid>
              <Grid.Column width={16} centered>
                <TextAreaField
                  label={i18next.t("Embargo reason")}
                  fieldPath="access.embargo.reason"
                  placeholder={i18next.t(
                    "Optionally, describe the reason for the embargo."
                  )}
                  optimized="true"
                />
              </Grid.Column>
            </Grid.Row>
          </>
        )}
        {embargoWasLifted && (
          <Grid.Row fluid>
            <Grid.Column width={16} centered>
              <p>
                {i18next.t(`Embargo was lifted on {{fmtDate}}.`, {
                  fmtDate: fmtDate,
                })}
              </p>
              {embargoReason && (
                <p>
                  <b>{i18next.t("Reason")}</b>: {embargoReason}.
                </p>
              )}
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </>
  );
};

EmbargoAccess.propTypes = {
  access: PropTypes.object.isRequired,
  metadataOnly: PropTypes.bool,
  communityAccess: PropTypes.string.isRequired,
  packageAccess: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

EmbargoAccess.defaultProps = {
  metadataOnly: false,
  disabled: false,
};
