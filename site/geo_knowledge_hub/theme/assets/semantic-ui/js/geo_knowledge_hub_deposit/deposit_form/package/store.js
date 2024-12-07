/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import thunk from "redux-thunk";

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { default as createReducers } from "./state/reducers";

const composeEnhancers = composeWithDevTools({
  name: "Deposit Interface",
});

export function configureStore(config) {
  const { activeFormName, packageObject, resourcesObject, depositConfig } =
    config;

  return createStore(
    createReducers(),
    {
      storage: {
        packageObject,
        resourcesObject,
        depositConfig,
      },
      layout: {
        activeFormName,
      },
    },
    composeEnhancers(applyMiddleware(thunk.withExtraArgument(config))),
  );
}
