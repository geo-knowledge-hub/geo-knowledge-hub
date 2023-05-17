/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { Icon, Dropdown } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { RequestModal } from "./RequestModal";

const availableRequests = [
  {
    key: 1,
    text: i18next.t("Feed post"),
    value: "feed-request",
  },
];

/**
 * Button to manage package requests.
 */
export const RequestButton = ({ disabled, record }) => {
  // States
  const [modalOpen, setModaOpen] = useState(false);

  // Auxiliary functions
  const handleOpen = () => setModaOpen(true);
  const handleClose = () => setModaOpen(false);

  return (
    <>
      <Dropdown
        text={
          <>
            <span style={{ marginLeft: "-30px" }}>Available requests</span>
          </>
        }
        options={availableRequests}
        simple
        item
        button
        labeled
        icon={"exchange"}
        className="icon"
        fluid
        // Temporary solution
        style={{ textAlign: "center" }}
      >
        <Dropdown.Menu fluid>
          <Dropdown.Header
            fluid
            content={i18next.t("Requests available")}
            icon={"arrow alternate circle right outline"}
          />
          {availableRequests.map((option) => (
            <Dropdown.Item fluid key={option.key} onClick={handleOpen} icon>
              <Icon name={"rss"} /> {option.text}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <RequestModal
        record={record}
        handleClose={handleClose}
        open={modalOpen}
      />
    </>
  );
};

RequestButton.propTypes = {
  disabled: PropTypes.bool,
  record: PropTypes.object.isRequired,
};

RequestButton.defaultProps = {
  disabled: false,
};
