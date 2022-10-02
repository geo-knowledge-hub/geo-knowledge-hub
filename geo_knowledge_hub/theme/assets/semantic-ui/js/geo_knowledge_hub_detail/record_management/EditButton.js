// This file is part of InvenioRDM
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from "react";
import PropTypes from "prop-types";

import { Icon, Button } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { axiosWithconfig } from "@invenio-app-rdm/utils";

/**
 * Edit button component.
 *
 * @note This component was adapted from Invenio App RDM to support
 *       Packages and Records.
 */
export const EditButton = ({ record, onError }) => {
  const [loading, setLoading] = useState(false);

  const recordDraftLink = record.links.draft || record.links.self;

  const handleClick = async () => {
    setLoading(true);
    try {
      axiosWithconfig.post(recordDraftLink).then((res) => {
        const responseData = res.data;
        window.location = responseData.links.self_html;
      });
    } catch (error) {
      setLoading(false);
      onError(error.response.data.message);
    }
  };

  return (
    <Button
      fluid
      className="warning"
      size="medium"
      onClick={handleClick}
      loading={loading}
      icon
      labelPosition="left"
    >
      <Icon name="edit" />
      {i18next.t("Edit")}
    </Button>
  );
};

EditButton.propTypes = {
  recid: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
};
