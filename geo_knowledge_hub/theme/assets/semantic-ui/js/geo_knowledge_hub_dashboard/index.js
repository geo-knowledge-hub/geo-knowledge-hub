/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
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
