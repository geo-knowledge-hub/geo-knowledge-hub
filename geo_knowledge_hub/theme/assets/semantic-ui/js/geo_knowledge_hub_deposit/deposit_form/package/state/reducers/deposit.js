/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import {
  // Deposit operation: General
  DEPOSIT_RESOURCES_CLEAN_STATES,
  DEPOSIT_RESOURCES_CLEAN_MESSAGE,
  DEPOSIT_RESOURCES_UNKNOWN_ERROR,
  // Deposit operation: Attaching
  DEPOSIT_RESOURCES_ATTACHING_START,
  DEPOSIT_RESOURCES_ATTACHING_FINISH,
  DEPOSIT_RESOURCES_ATTACHING_ERROR,
  DEPOSIT_RESOURCES_ATTACHING_SUCCESS,
  // Deposit operation: Associating and attaching resources
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_START,
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_ERROR,
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_SUCCESS,
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_FINISH,
  // Deposit operation: Saving draft
  DEPOSIT_RESOURCE_SAVING_DRAFT_START,
  DEPOSIT_RESOURCE_SAVING_DRAFT_ERROR,
  DEPOSIT_RESOURCE_SAVING_DRAFT_SUCCESS,
  DEPOSIT_RESOURCE_SAVING_DRAFT_FINISH,
  // Deposit operation: Importing resources from one version to another
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_START,
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_ERROR,
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_SUCCESS,
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_FINISH,
  // Deposit operation: Editing a resource
  DEPOSIT_RESOURCE_EDITING_RESOURCE_START,
  DEPOSIT_RESOURCE_EDITING_RESOURCE_ERROR,
  DEPOSIT_RESOURCE_EDITING_RESOURCE_SUCCESS,
  DEPOSIT_RESOURCE_EDITING_RESOURCE_FINISH,
  // Deposit operation: Detaching a resource from the package
  DEPOSIT_RESOURCES_DETACHING_START,
  DEPOSIT_RESOURCES_DETACHING_FINISH,
  DEPOSIT_RESOURCES_DETACHING_SUCCESS,
  DEPOSIT_RESOURCES_DETACHING_ERROR,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_START,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_ERROR,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_SUCCESS,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_FINISH,
} from "../actions";

const initialState = {
  depositHasUpdated: false,
  depositOperationRecord: {},
  depositSaveOperationInProgress: false,
  depositOperationMetadata: {},
  depositOperationInProgress: false,
  depositOperationMessage: {},
};

export const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    // Deposit operation: Generic error
    case DEPOSIT_RESOURCES_UNKNOWN_ERROR:
      return { ...state, depositOperationMessage: action.payload };

    case DEPOSIT_RESOURCES_CLEAN_MESSAGE:
      return { ...state, depositOperationMessage: {} };

    case DEPOSIT_RESOURCES_CLEAN_STATES:
      return { ...state, depositHasUpdated: false };

    case DEPOSIT_RESOURCES_ATTACHING_START:
    case DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_START:
    case DEPOSIT_RESOURCE_SAVING_DRAFT_START:
    case DEPOSIT_RESOURCE_IMPORTING_RESOURCES_START:
    case DEPOSIT_RESOURCE_EDITING_RESOURCE_START:
    case DEPOSIT_RESOURCES_DETACHING_START:
    case DEPOSIT_RESOURCE_VERSION_RESOURCE_START:
      return {
        ...state,
        depositOperationMessage: {},
        depositOperationMetadata: action.payload,
        depositOperationInProgress: true,
      };

    case DEPOSIT_RESOURCES_ATTACHING_SUCCESS:
    case DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_SUCCESS:
    case DEPOSIT_RESOURCE_SAVING_DRAFT_SUCCESS:
    case DEPOSIT_RESOURCE_IMPORTING_RESOURCES_SUCCESS:
    case DEPOSIT_RESOURCE_EDITING_RESOURCE_SUCCESS:
    case DEPOSIT_RESOURCES_DETACHING_SUCCESS:
    case DEPOSIT_RESOURCE_VERSION_RESOURCE_SUCCESS:
      return {
        ...state,
        depositHasUpdated: true,
        depositOperationMessage: action.payload,
      };

    case DEPOSIT_RESOURCES_ATTACHING_ERROR:
    case DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_ERROR:
    case DEPOSIT_RESOURCE_SAVING_DRAFT_ERROR:
    case DEPOSIT_RESOURCE_IMPORTING_RESOURCES_ERROR:
    case DEPOSIT_RESOURCE_EDITING_RESOURCE_ERROR:
    case DEPOSIT_RESOURCES_DETACHING_ERROR:
    case DEPOSIT_RESOURCE_VERSION_RESOURCE_ERROR:
      return {
        ...state,
        depositOperationMessage: action.payload,
      };

    case DEPOSIT_RESOURCES_ATTACHING_FINISH:
    case DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_FINISH:
    case DEPOSIT_RESOURCE_SAVING_DRAFT_FINISH:
    case DEPOSIT_RESOURCE_IMPORTING_RESOURCES_FINISH:
    case DEPOSIT_RESOURCE_EDITING_RESOURCE_FINISH:
    case DEPOSIT_RESOURCES_DETACHING_FINISH:
    case DEPOSIT_RESOURCE_VERSION_RESOURCE_FINISH:
      return {
        ...state,
        depositOperationMetadata: {},
        depositOperationInProgress: false,
      };

    default:
      return state;
  }
};
