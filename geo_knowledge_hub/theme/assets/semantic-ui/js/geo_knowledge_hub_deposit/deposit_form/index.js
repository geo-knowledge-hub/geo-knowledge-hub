/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";
import { getInputFromDOM } from "@geo-knowledge-hub/react-invenio-deposit";

import { KnowledgePackageDepositApp } from "./KnowledgePackageDepositApp";

ReactDOM.render(
  <KnowledgePackageDepositApp
    record={getInputFromDOM("deposits-record")}
    files={getInputFromDOM("deposits-record-files")}
    config={getInputFromDOM("deposits-config")}
    permissions={getInputFromDOM("deposits-record-permissions")}
  />,
  document.getElementById("deposit-form")
);
