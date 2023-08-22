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
import { RequestFeedPostModal } from "./requests";

const availableRequests = [
  {
    key: 1,
    text: i18next.t("Feed post"),
    value: "feed-post-creation",
    icon: "rss",
    component: RequestFeedPostModal,
  },
];

/**
 * Button to manage package requests.
 */
export const RequestButton = ({ record, assistanceRequests }) => {
  // States
  const [modalOpen, setModaOpen] = useState(null);

  // Auxiliary functions
  const handleOpen = (modalId) => setModaOpen(modalId);
  const handleClose = () => setModaOpen(null);

  return (
    <>
      <Dropdown
        text={
          <>
            <span style={{ marginLeft: "-30px" }}>Requests</span>
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
            content={i18next.t("Available requests")}
            icon={"arrow alternate circle right outline"}
          />
          {availableRequests.map((option) => (
            <Dropdown.Item
              fluid
              key={option.key}
              onClick={() => handleOpen(option.key)}
              icon
              disabled={assistanceRequests[option.value]}
            >
              <Icon name={option.icon} /> {option.text}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {availableRequests.map((option) => {
        const Component = option.component;
        return (
          <Component
            record={record}
            handleClose={handleClose}
            open={modalOpen === option.key && !assistanceRequests[option.value]}
            assistanceRequests={assistanceRequests}
          />
        );
      })}
    </>
  );
};

RequestButton.propTypes = {
  record: PropTypes.object.isRequired,
  assistanceRequests: PropTypes.object,
};

RequestButton.defaultProps = {
  assistanceRequests: {},
};
