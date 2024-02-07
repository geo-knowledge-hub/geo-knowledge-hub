/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _set from "lodash/set";

import {
  STORAGE_UPDATE_PACKAGE_DATA,
  STORAGE_CLEAN_RESOURCE_TEMPORARY_DATA,
  STORAGE_SAVE_RESOURCE_TEMPORARY_DATA,
  DEPOSIT_RESOURCES_UNKNOWN_ERROR,
  STORAGE_UPDATE_CONFIG_RESOURCE_SEARCH,
} from "../actions";

import { PackagesApiClient } from "../../../../resources";

import { i18next } from "@translations/geo_knowledge_hub/i18next";

/**
 * Dispatch operation to save resource draft data into storage.
 */
export const storageSaveResourceTemporaryData = (resourceData) => {
  return async (dispatch) => {
    dispatch({
      type: STORAGE_SAVE_RESOURCE_TEMPORARY_DATA,
      payload: resourceData,
    });
  };
};

/**
 * Dispatch operation to clean resource draft data from storage.
 */
export const storageCleanResourceTemporaryData = () => {
  return async (dispatch) => {
    dispatch({
      type: STORAGE_CLEAN_RESOURCE_TEMPORARY_DATA,
      payload: {},
    });
  };
};

/**
 * Store Package record data into the storage store.
 */
export const storageUpdatePackageRecord = (packageRecord) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: STORAGE_UPDATE_PACKAGE_DATA,
      payload: packageRecord,
    });

    // Updating the configuration to search for package resources
    dispatch(storageUpdateConfigResourceSearch(packageRecord));
  };
};

/**
 * Dispatch operation to update the configuration used to get data from
 * package resources.
 */
export const storageUpdateConfigResourceSearch = (packageRecord) => {
  return async (dispatch, getState) => {
    // Getting the current deposit config state
    const currentState = getState();
    const { depositConfig } = currentState.storage;

    // Extracting the resources search link
    const { record } = packageRecord;

    const { resources: resourceSearchLink } = record.links;

    // Updating the resource search link
    _set(
      depositConfig,
      "resource.search.searchApi.axios.url",
      resourceSearchLink
    );

    dispatch({
      type: STORAGE_UPDATE_CONFIG_RESOURCE_SEARCH,
      payload: depositConfig,
    });
  };
};

/**
 * Reload package record data from GEO Knowledge Hub API.
 */
export const storageReloadPackageRecord = (baseRecord = null) => {
  return async (dispatch, getState) => {
    // Loading current state.
    const currentState = getState();

    const { packageObject } = currentState.storage;
    let { record: packageRecord } = packageObject;

    if (baseRecord) {
      packageRecord = baseRecord;
    }

    const operationTitleError = i18next.t(
      "Error to synchronize the package with the GEO Knowledge Hub API."
    );

    // Reloading package from server
    const packagesApiClient = new PackagesApiClient();

    try {
      // 1. Reading data from service.
      const response = await packagesApiClient.read(packageRecord);

      // 2. Checking for errors
      if (response.code !== 200) {
        dispatch({
          type: DEPOSIT_RESOURCES_UNKNOWN_ERROR,
          payload: {
            title: operationTitleError,
            errors: [
              {
                message: i18next.t(
                  "Error in connecting with the GEO Knowledge Hub API"
                ),
              },
            ],
          },
        });
      }
      // 3. Saving new data loaded.
      else {
        const newRecordData = response.data;

        dispatch(
          storageUpdatePackageRecord({
            record: newRecordData,
            files: newRecordData?.files,
            permissions: packageObject?.permissions,
          })
        );
      }
    } catch (error) {
      dispatch({
        type: DEPOSIT_RESOURCES_UNKNOWN_ERROR,
        payload: {
          title: operationTitleError,
          errors: [
            {
              message: i18next.t(
                "Error in connecting with the GEO Knowledge Hub API"
              ),
            },
          ],
        },
      });
    }
  };
};
