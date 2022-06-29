/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { createStore } from "redux";

import knowledgePackageReducer from "./lib/state/reducers";

// simple context
export const geoGlobalContext = React.createContext({});

// creating an store
export const geoGlobalStore = createStore(knowledgePackageReducer);
