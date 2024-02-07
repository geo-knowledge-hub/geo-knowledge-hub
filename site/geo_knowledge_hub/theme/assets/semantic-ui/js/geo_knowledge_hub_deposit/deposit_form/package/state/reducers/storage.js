/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import {
  STORAGE_CLEAN_RESOURCE_TEMPORARY_DATA,
  STORAGE_SAVE_RESOURCE_TEMPORARY_DATA,
  STORAGE_UPDATE_PACKAGE_DATA,
  STORAGE_UPDATE_CONFIG_RESOURCE_SEARCH,
} from "../actions";

const initialState = {
  packageObject: {},
  resourcesObject: {},
  depositConfig: {},
  resourceTemporaryObject: {}, // Resource created in the resource interface
};

export const storageReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORAGE_UPDATE_PACKAGE_DATA:
      return { ...state, packageObject: action.payload };

    case STORAGE_SAVE_RESOURCE_TEMPORARY_DATA:
      return { ...state, resourceTemporaryObject: action.payload };

    case STORAGE_CLEAN_RESOURCE_TEMPORARY_DATA:
      return { ...state, resourceTemporaryObject: {} };

    case STORAGE_UPDATE_CONFIG_RESOURCE_SEARCH:
      return { ...state, depositConfig: action.payload };

    default:
      return state;
  }
};
