/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { combineReducers } from "redux";

import { storageReducer } from "./storage";
import { depositReducer } from "./deposit";
import { layoutReducer, layoutResourcesReducer } from "./layout";

export default function createReducers() {
  return combineReducers({
    // Layout
    layout: layoutReducer,
    layoutResources: layoutResourcesReducer,
    // Storage
    storage: storageReducer,
    // Deposit
    deposit: depositReducer,
  });
}
