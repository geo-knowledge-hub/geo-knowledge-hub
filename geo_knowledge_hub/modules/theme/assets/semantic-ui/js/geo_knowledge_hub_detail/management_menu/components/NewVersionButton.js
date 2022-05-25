// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from "react";
import axios from "axios";
import { Icon, Button, Popup } from "semantic-ui-react";
import { i18next } from "@translations/invenio_app_rdm/i18next";

const apiConfig = {
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
};
const axiosWithconfig = axios.create(apiConfig);

export const NewVersionButton = ({ onError, record, disabled, ...uiProps }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      // 1. publishing
      const response = await axiosWithconfig.post(record.links.versions);

      // 2. editing the response
      const newRecordVersion = response.data;
      newRecordVersion.metadata.related_identifiers = [];

      await axiosWithconfig.put(newRecordVersion.links.self, newRecordVersion);

      window.location = response.data.links.self_html;
    } catch (error) {
      console.log(error);
      setLoading(false);
      onError(error.response.data.message);
    }
  };

  return (
    <Popup
      content={i18next.t("You don't have permissions to create a new version.")}
      disabled={!disabled}
      trigger={
        <Button
          type="button"
          color="green"
          size="mini"
          onClick={handleClick}
          loading={loading}
          icon
          {...uiProps}
        >
          <Icon name="tag" />
          {i18next.t("New version")}
        </Button>
      }
    />
  );
};
