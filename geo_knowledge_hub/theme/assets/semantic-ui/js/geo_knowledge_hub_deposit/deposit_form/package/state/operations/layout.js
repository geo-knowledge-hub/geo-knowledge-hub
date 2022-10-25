/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import {
  // Layout: General
  LAYOUT_CHANGE_ACTIVE_FORM,
  DEPOSIT_RESOURCES_CLEAN_STATES,
  // Layout: Modal Layout to create/edit resources.
  LAYOUT_RESOURCES_OPEN_RESOURCE_MODAL,
  LAYOUT_RESOURCES_CLOSE_RESOURCE_MODAL,
  // Layout: Modal Layout to edit records permissions.
  LAYOUT_RESOURCES_OPEN_MANAGEMENT_PERMISSIONS_MODAL,
  LAYOUT_RESOURCES_CLOSE_MANAGEMENT_PERMISSIONS_MODAL,
  // Layout: Update/Change resource list
  LAYOUT_RESOURCES_START_UPDATE_RESOURCE_LIST,
  LAYOUT_RESOURCES_FINISH_UPDATE_RESOURCE_LIST,
  // Layout: Modal Layout to search for existing resources.
  LAYOUT_RESOURCES_OPEN_RESOURCE_SEARCH_MODAL,
  LAYOUT_RESOURCES_CLOSE_RESOURCE_SEARCH_MODAL,
} from "../actions";

/**
 * Dispatch operation to open the modal used to
 * create/edit resources.
 */
export const layoutResourcesOpenModal = (modalData) => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_RESOURCES_OPEN_RESOURCE_MODAL,
      payload: modalData,
    });
  };
};

/**
 * Dispatch operation to close the modal used to
 * create/edit resources.
 */
export const layoutResourcesCloseModal = () => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_RESOURCES_CLOSE_RESOURCE_MODAL,
    });
  };
};

/**
 * Dispatch operation to open the management permission modal.
 */
export const layoutResourcesOpenModalManagementPermissions = () => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_RESOURCES_OPEN_MANAGEMENT_PERMISSIONS_MODAL,
    });
  };
};

/**
 * Dispatch operation to close the management permission modal.
 */
export const layoutResourcesCloseModalManagementPermissions = () => {
  return async (dispatch, getState) => {
    // Checking if we need to update the resource result list
    const currentState = getState();
    const depositHasUpdated = currentState.deposit.depositHasUpdated;

    if (depositHasUpdated) {
      dispatch(layoutResourcesStartUpdateResourceList());
      dispatch({
        type: DEPOSIT_RESOURCES_CLEAN_STATES,
      });
    }

    dispatch({
      type: LAYOUT_RESOURCES_CLOSE_MANAGEMENT_PERMISSIONS_MODAL,
    });
  };
};

/**
 * Dispatch operation to change the active window form.
 */
export const layoutChangeActiveForm = (formName) => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_CHANGE_ACTIVE_FORM,
      payload: formName,
    });
  };
};

/**
 * Dispatch operation to start the update the package's resource list.
 */
export const layoutResourcesStartUpdateResourceList = () => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_RESOURCES_START_UPDATE_RESOURCE_LIST,
    });
  };
};

/**
 * Dispatch operation to finish the update the package's resource list.
 */
export const layoutResourcesFinishUpdateResourceList = () => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_RESOURCES_FINISH_UPDATE_RESOURCE_LIST,
    });
  };
};

/**
 * Dispatch operation to open the modal used to search for
 * existing resources.
 */
export const layoutResourcesOpenModalSearch = (baseType) => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_RESOURCES_OPEN_RESOURCE_SEARCH_MODAL,
      payload: baseType,
    });
  };
};

/**
 * Dispatch operation to close the modal used to search for
 * existing resources.
 */
export const layoutResourcesCloseModalSearch = () => {
  return async (dispatch) => {
    dispatch({
      type: LAYOUT_RESOURCES_CLOSE_RESOURCE_SEARCH_MODAL,
    });
  };
};
