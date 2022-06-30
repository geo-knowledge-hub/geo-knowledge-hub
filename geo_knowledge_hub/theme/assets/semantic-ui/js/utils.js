/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from "lodash/get";

/**
 * Extract a GEO Work Programme Activity Name from a String
 *
 * @param {string} programmeActivityName String containing the Programme Name
 */
export const extractProgrammeActivityAcronym = (programmeActivityName) =>
  programmeActivityName
    ? _get(programmeActivityName.match(/\(([^)]+)\)/), 1, null)
    : null;
