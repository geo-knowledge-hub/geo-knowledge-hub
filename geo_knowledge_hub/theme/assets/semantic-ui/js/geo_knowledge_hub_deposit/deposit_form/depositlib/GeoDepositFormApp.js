/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { GeoDepositApiClient } from "./GeoDepositApiClient";
import { DepositFormApp, DepositFileUploader } from "@geo-knowledge-hub/react-invenio-deposit";

import { DepositRecordSerializer } from "./serializers";

export class GeoDepositFormApp extends DepositFormApp {
  constructor(props) {
    // defining API Client config
    const apiClientConfig = props.apiClientConfig || props.config;

    // creating custom serializer (with support for custom fields)
    const recordSerializer = new DepositRecordSerializer(props.config.default_locale);

    // preparing the new instance controller
    let controller = null;
    if (props.controller) {
      const apiClient = new GeoDepositApiClient(apiClientConfig.createUrl);
      const fileUploader = new DepositFileUploader(apiClient, props.config);

      controller = new props.controller(apiClient, fileUploader);
    }

    super({ ...props, controller: controller, recordSerializer: recordSerializer });
  }
}
