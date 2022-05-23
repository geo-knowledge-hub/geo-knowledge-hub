/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2019-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { DashboardTabs } from "./components";

/**
 * Rendering the component.
 */
const rootElement = document.getElementById("invenio-user-dashboard");

if (rootElement) {
  ReactDOM.render(<DashboardTabs />, rootElement);
}
