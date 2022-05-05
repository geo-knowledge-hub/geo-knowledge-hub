import React from "react";
import ReactDOM from "react-dom";
import { getInputFromDOM } from "react-invenio-deposit";

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
