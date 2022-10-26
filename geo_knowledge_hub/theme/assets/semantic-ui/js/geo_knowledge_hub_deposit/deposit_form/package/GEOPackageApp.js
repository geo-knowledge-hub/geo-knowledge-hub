/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { Provider } from "react-redux";

import { LayoutForms, LayoutFormTypes } from "./components";

import { configureStore } from "./store";

export class GEOPackageApp extends Component {
  constructor(props) {
    super(props);

    // Base parameters
    const {
      packageRecord,
      packageRecordFiles,
      packageRecordPermissions,
      packageCommunity,
      recordTemplate,
      depositConfigPackage,
      depositConfigResource,
      depositConfigResourceSearch,
      resourceRecordsPermissions,
    } = this.props;

    const appConfig = {
      activeFormName: LayoutFormTypes.Package, // Default is the package view
      packageObject: {
        record: packageRecord,
        files: packageRecordFiles,
        permissions: packageRecordPermissions,
        community:
          packageCommunity ||
          packageRecord?.expanded?.parent?.review?.receiver ||
          null,
      },
      resourcesObject: {
        permissions: resourceRecordsPermissions,
      },
      depositConfig: {
        package: {
          record: depositConfigPackage,
        },
        resource: {
          record: depositConfigResource,
          search: depositConfigResourceSearch,
          files: {
            default_preview: null,
            entries: [],
            links: {},
          },
        },
        templates: {
          record: recordTemplate,
        },
      },
    };

    this.store = configureStore(appConfig);
  }

  render() {
    return (
      <Provider store={this.store}>
        <LayoutForms />
      </Provider>
    );
  }
}
