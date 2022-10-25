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
 * Metadata Access component.
 *
 * @note This component is based on `MetadataAccess` available
 *       on React Invenio Deposit.
 */
export const MetadataAccess = ({
  recordAccess,
  packageAccess,
  communityAccess,
  disabled,
}) => {
  const publicPackage = packageAccess === "public";
  const publicMetadata = recordAccess === "public";
  const publicCommunity = communityAccess === "public";

  return (
    <>
      <Table.Cell>
        <Grid textAlign="center" verticalAlign="middle" className={"mt-5 mb-5"}>
          <div className="flex align-items-center members-dropdown-container">
            <ProtectionDropdown
              disabled={disabled || !publicPackage || !publicCommunity}
              fieldPath={"access.record"}
            />
          </div>
        </Grid>
      </Table.Cell>
    </>
  );
};

MetadataAccess.propTypes = {
  recordAccess: PropTypes.string.isRequired,
  packageAccess: PropTypes.string.isRequired,
  communityAccess: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

MetadataAccess.defaultProps = {
  disabled: false,
};
