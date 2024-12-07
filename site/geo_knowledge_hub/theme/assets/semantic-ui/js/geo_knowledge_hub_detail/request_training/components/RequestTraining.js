/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2023 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

import { RequestTrainingModal } from "./RequestTrainingModal";

/**
 * Request training button.
 */
export const RequestTraining = ({
  record,
  userIsAuthenticated,
  existingAssistanceRequests,
}) => {
  // Definitions
  const requestType = "requests-assistance-training-creation";

  //   States
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validations
  const userRequestId = existingAssistanceRequests[requestType];
  const userHasRequest = !!userRequestId;

  return (
    <>
      <Button
        fluid
        size={"huge"}
        animated={"fade"}
        className={"details-request-training-button"}
        onClick={() => {
          if (userHasRequest) {
            window.location.href = `/me/requests/${userRequestId}`;
          } else {
            setIsModalOpen(true);
          }
        }}
      >
        <Button.Content visible>Need training?</Button.Content>
        <Button.Content hidden>👆 Click to request! 🚀</Button.Content>
      </Button>

      <RequestTrainingModal
        record={record}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        userIsAuthenticated={userIsAuthenticated}
      />
    </>
  );
};

RequestTraining.propTypes = {
  record: PropTypes.object.isRequired,
  userIsAuthenticated: PropTypes.bool.isRequired,
  existingAssistanceRequests: PropTypes.object,
};

RequestTraining.defaultProps = {
  existingAssistanceRequests: {},
};
