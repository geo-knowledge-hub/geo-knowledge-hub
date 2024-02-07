/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import {
  LAYOUT_CHANGE_ACTIVE_FORM,
  LAYOUT_RESOURCES_CLOSE_MANAGEMENT_PERMISSIONS_MODAL,
  LAYOUT_RESOURCES_CLOSE_RESOURCE_MODAL,
  LAYOUT_RESOURCES_CLOSE_RESOURCE_SEARCH_MODAL,
  LAYOUT_RESOURCES_FINISH_UPDATE_RESOURCE_LIST,
  LAYOUT_RESOURCES_OPEN_MANAGEMENT_PERMISSIONS_MODAL,
  LAYOUT_RESOURCES_OPEN_RESOURCE_MODAL,
  LAYOUT_RESOURCES_OPEN_RESOURCE_SEARCH_MODAL,
  LAYOUT_RESOURCES_START_UPDATE_RESOURCE_LIST,
} from "../actions";

const initialLayoutState = {
  activeFormName: null,
};

const initialLayoutResourceReducer = {
  resourceModalOpen: false,
  resourceModalData: {},
  resourceListUpdate: false,
  resourceSearchModalOpen: false,
  resourceSearchModalData: {},
  resourceManagementPermissionOpen: false,
  resourceManagementPermissionData: {},
};

export const layoutReducer = (state = initialLayoutState, action) => {
  switch (action.type) {
    case LAYOUT_CHANGE_ACTIVE_FORM:
      return { ...state, activeFormName: action.payload };

    default:
      return state;
  }
};

export const layoutResourcesReducer = (
  state = initialLayoutResourceReducer,
  action
) => {
  switch (action.type) {
    // Deposit operation: Modal Layout to create/edit resources.
    case LAYOUT_RESOURCES_OPEN_RESOURCE_MODAL:
      return {
        ...state,
        resourceModalOpen: true,
        resourceModalData: action.payload,
      };

    case LAYOUT_RESOURCES_CLOSE_RESOURCE_MODAL:
      return { ...state, resourceModalOpen: false, resourceModalData: {} };

    // Resource list (Search)
    case LAYOUT_RESOURCES_START_UPDATE_RESOURCE_LIST:
      return { ...state, resourceListUpdate: true };

    case LAYOUT_RESOURCES_FINISH_UPDATE_RESOURCE_LIST:
      return { ...state, resourceListUpdate: false };

    // Search Result Modal
    case LAYOUT_RESOURCES_OPEN_RESOURCE_SEARCH_MODAL:
      return {
        ...state,
        resourceSearchModalOpen: true,
        resourceSearchModalData: action.payload,
      };
    case LAYOUT_RESOURCES_CLOSE_RESOURCE_SEARCH_MODAL:
      return {
        ...state,
        resourceSearchModalOpen: false,
        resourceSearchModalData: {},
      };

    // Management permissions modal
    case LAYOUT_RESOURCES_OPEN_MANAGEMENT_PERMISSIONS_MODAL:
      return { ...state, resourceManagementPermissionOpen: true };

    case LAYOUT_RESOURCES_CLOSE_MANAGEMENT_PERMISSIONS_MODAL:
      return { ...state, resourceManagementPermissionOpen: false };

    default:
      return state;
  }
};
