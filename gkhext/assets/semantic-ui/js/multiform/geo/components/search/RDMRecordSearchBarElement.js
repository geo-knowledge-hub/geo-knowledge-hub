// This file is part of InvenioRDM
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import _get from "lodash/get";
import _isEmpty from 'lodash/isEmpty';

import React from "react";

import { Input } from "semantic-ui-react";
import _truncate from "lodash/truncate";

import {i18next} from "@translations/invenio_app_rdm/i18next";

const SingletonSearch = {originalQueryString: null};


export const RDMRecordSearchBarElement = ({
                                            placeholder: passedPlaceholder,
                                            queryString,
                                            onInputChange, // ToDo: Filter the search parameters
                                            executeSearch,
                                          }) => {
  const placeholder = passedPlaceholder || i18next.t("Search");

  if (SingletonSearch.originalQueryString === null) {
    SingletonSearch.originalQueryString = queryString;

    queryString = "";
  }

  let updatedQuery = SingletonSearch.originalQueryString;
  if (!_isEmpty(queryString)) { 
    updatedQuery = SingletonSearch.originalQueryString + `AND (metadata.title: "${queryString}"~ metadata.description: "${queryString}"~)`;
  }

  const onBtnSearchClick = () => {
    onInputChange(updatedQuery);
    executeSearch(); // ToDo: Filter the search parameters
  };
  const onKeyPress = (event) => {
    if (event.key === "Enter") {
      onInputChange(updatedQuery);
      executeSearch();
    }
  };
  return (
    <Input
      action={{
        icon: "search",
        onClick: onBtnSearchClick,
        className: "search",
      }}
      fluid
      placeholder={placeholder}
      onChange={(event, {value}) => {
        // onInputChange(value);  // ToDo: Change this only for the initial query
      }}
      value={"Search (Disabled)"} // ToDo: Change this only for the initial query
      onKeyPress={onKeyPress}
    />
  );
};
