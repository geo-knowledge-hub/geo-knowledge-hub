/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";

import { Table, Grid } from "semantic-ui-react";

import { ProtectionDropdown } from "./ProtectionDropdown";

/**
 * Files Access component.
 *
 * @note This component is based on `FilesAccess` available
 *       on React Invenio Deposit.
 */
export const FilesAccess = ({
  access,
  communityAccess,
  packageAccess,
  isMetadataOnly,
  disabled,
}) => {
  const publicFiles = access.files === "public";
  const publicRecord = access.record === "public";
  const publicCommunity = communityAccess === "public";
  const publicPackage = packageAccess === "public";

  return (
    <>
      <Table.Cell>
        <Grid textAlign="center" verticalAlign="middle" className={"mt-5 mb-5"}>
          <div className="flex align-items-center members-dropdown-container">
            <ProtectionDropdown
              disabled={
                disabled ||
                !publicRecord ||
                !publicPackage ||
                !publicCommunity ||
                isMetadataOnly
              }
              fieldPath={"access.files"}
            />
          </div>
        </Grid>
      </Table.Cell>
    </>
  );
};

FilesAccess.propTypes = {
  access: PropTypes.object.isRequired,
  isMetadataOnly: PropTypes.bool,
  communityAccess: PropTypes.string.isRequired,
  packageAccess: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

FilesAccess.defaultProps = {
  isMetadataOnly: false,
  disabled: false,
};
