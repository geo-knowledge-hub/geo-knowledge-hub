// This file is part of InvenioRDM
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from "react";
import ReactDOM from "react-dom";
import { getInputFromDOM } from "react-invenio-deposit";
import "semantic-ui-css/semantic.min.css";
import { RDMDepositApp } from "./RDMDepositApp";

ReactDOM.render(
  <RDMDepositApp
    record={getInputFromDOM("deposits-record")}
    recordTemplate={getInputFromDOM("deposits-record-template")}
    preselectedCommunity={getInputFromDOM("deposits-draft-community")}
    files={getInputFromDOM("deposits-record-files")}
    config={getInputFromDOM("deposits-package-config")}
    configRecordDeposit={getInputFromDOM("deposits-record-config")}
    configRecordSearch={getInputFromDOM("deposits-record-search-config")}
    permissions={getInputFromDOM("deposits-record-permissions")}
  />,
  document.getElementById("deposit-form")
);
