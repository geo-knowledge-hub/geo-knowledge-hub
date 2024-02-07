/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { overrideStore } from "react-overridable";

/**
 * Update the `Store` of the `React SearchKit` with new components.
 *
 * @todo Check if this is the best approach to do this.
 *
 * @param {Array} components array of components
 */
export const updateReactSearchKitStore = (components) => {
  Object.entries(components).forEach((element) => {
    const [componentId, component] = element;
    overrideStore.add(componentId, component);
  });
};
