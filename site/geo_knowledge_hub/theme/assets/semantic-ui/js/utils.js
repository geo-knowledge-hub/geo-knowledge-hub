/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from "lodash/get";


/**
 * Extract Record badge.
 *
 * @param {string} recordType String containing the type of record.
 */
export const extractRecordBadge = (recordType) => {
  let recordBadge = {
    name: "Open",
    color: "primary",
    icon: "lock open"
  };

  // Currently, we only have "Marketplace Item" as closed records
  if (recordType === "marketplace-item") {
    recordBadge = {
      name: "Commercial",
      color: "primary",
      icon: "building"
    }
  }

  return recordBadge;
}


/**
 * Extract a GEO Work Programme Activity Name from a String
 *
 * @param {string} programmeActivityName String containing the Programme Name
 */
export const extractProgrammeActivityAcronym = (programmeActivityName) =>
  programmeActivityName
    ? _get(programmeActivityName.match(/\(([^)]+)\)/), 1, null)
    : null;

/**
 * Generate record links based on parent type.
 *
 * @param {string} recordId Record Identifier (PID)
 * @param {string} recordType Record type (e.g., package, resource)
 * @returns {object} Object with the links created.
 */
export const recordTypeLinksFactory = (recordId, recordType) => {
  const recordLinks = {
    package: {
      published: {
        api: `/api/packages/${recordId}`,
        ui: `/packages/${recordId}`,
      },
      draft: {
        api: `/api/packages/${recordId}/draft`,
        ui: `/uploads/packages/${recordId}`,
      },
    },
    resource: {
      published: {
        api: `/api/records/${recordId}`,
        ui: `/records/${recordId}`,
      },
      draft: {
        api: `/api/records/${recordId}/draft`,
        ui: `/records/${recordId}?preview=1`,
      },
    },
    "marketplace-item": {
      published: {
        api: `/api/marketplace/items/${recordId}`,
        ui: `/marketplace/items/${recordId}`,
      },
      draft: {
        api: `/api/marketplace/items/${recordId}/draft`,
        ui: `/uploads/marketplace/items/${recordId}`,
      },
    }
  };

  return recordLinks[recordType];
};
