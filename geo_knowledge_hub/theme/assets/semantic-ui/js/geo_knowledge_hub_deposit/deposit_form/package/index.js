/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import { getInputFromDOM } from "react-invenio-deposit";

import "semantic-ui-css/semantic.min.css";

import { GEOPackageApp } from "./GEOPackageApp";

ReactDOM.render(
  <GEOPackageApp
    packageRecord={getInputFromDOM("deposits-package")}
    packageRecordFiles={getInputFromDOM("deposits-package-files")}
    packageRecordPermissions={getInputFromDOM("deposits-package-permissions")}
    packageCommunity={getInputFromDOM("deposits-draft-community")}
    recordTemplate={getInputFromDOM("deposits-record-template")}
    depositConfigPackage={getInputFromDOM("deposits-package-config")}
    depositConfigResource={getInputFromDOM("deposits-record-config")}
    depositConfigResourceSearch={getInputFromDOM(
      "deposits-record-search-config"
    )}
    resourceRecordsPermissions={getInputFromDOM(
      "deposits-related-record-permissions"
    )}
  />,
  document.getElementById("deposit-form")
);
