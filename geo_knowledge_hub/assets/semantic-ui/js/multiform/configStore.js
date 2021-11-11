import React from "react";
import { createStore } from "redux";

import knowledgePackageReducer from "./geo/state/reducers";

// simple context
export const geoGlobalContext = React.createContext({});

// creating an store
export const geoGlobalStore = createStore(knowledgePackageReducer);
