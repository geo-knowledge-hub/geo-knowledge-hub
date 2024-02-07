/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2023 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import * as Yup from "yup";
import { Formik } from "formik";
import { FieldLabel, RichInputField, http } from "react-invenio-forms";

import { Button, Message, Modal, Grid } from "semantic-ui-react";

import { Trans } from "react-i18next";
import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Request training modal.
 */
export const RequestTrainingModal = ({
  userIsAuthenticated,
  record,
  isOpen,
  onClose,
}) => {
  //   States
  const [hasRequestError, setHasRequestError] = useState(false);

  //   Auxiliary functions
  const onSubmit = (props) => {
    // Preparing data to create the training request
    const requestType = "requests-assistance-training-creation";

    const recordId = record.id;
    const recordApiUrl = record.links.self;
    const recordRequestsUrl = record.links.requests;

    http
      .put(recordRequestsUrl, {
        topic: {
          package_record: recordId,
        },
        type: requestType,
      })
      .then((createRequestResponse) => {
        // Checking if the request is already submitted
        const requestId = createRequestResponse.data.id;
        const isSubmitted = createRequestResponse.data.status === "submitted";

        if (isSubmitted) {
          window.location.href = `/me/requests/${requestId}`;
        } else {
          const recordSubmitUrl = `${recordApiUrl}/actions/submit-request`;

          // Submitting request
          http
            .post(recordSubmitUrl, props)
            .then((submitRequestResponse) => {
              // Preparing data
              const requestId = submitRequestResponse.data.id;

              // Sending user to the request page
              window.location.href = `/me/requests/${requestId}`;
            })
            .catch((error) => {
              setHasRequestError(true);
            });
        }
      })
      .catch((error) => {
        setHasRequestError(true);
      });
  };

  //   Configurations
  const initialValues = {
    payload: {
      content: "",
      format: "html",
    },
  };

  const validationSchema = Yup.object().shape({
    payload: Yup.object().shape({
      content: Yup.string().required(
        "Please, provide more context on why you need this training.",
      ),
      format: Yup.string().required(),
    }),
  });

  const descriptionFieldPath = "payload.content";

  // Defining the button text based on user auth state
  const requestButton = userIsAuthenticated
    ? i18next.t("Submit request")
    : i18next.t("You need to be logged in to make this request");

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => {
        return (
          <Modal centered closeIcon open={isOpen} onClose={onClose}>
            <Modal.Header>Request: Training session</Modal.Header>
            <Modal.Content>
              {hasRequestError && (
                <Message negative>
                  <Message.Header>
                    <Trans>There was a problem to process your request.</Trans>
                  </Message.Header>
                  <Trans>
                    <p>Please, try again later.</p>
                  </Trans>
                </Message>
              )}
              <Message
                icon={"bullhorn"}
                header={i18next.t(
                  "We'd love to help you understand and use the knowledge of this package",
                )}
                content={
                  <div className={"mt-10"}>
                    <Trans>
                      The GEO Knowledge Hub team will try to organize the
                      training session by making this request. During the
                      process, we keep you updated with notifications and
                      e-mails.
                    </Trans>
                  </div>
                }
              />
            </Modal.Content>
            <Modal.Content>
              <RichInputField
                required
                fieldPath={descriptionFieldPath}
                label={
                  <FieldLabel
                    htmlFor={descriptionFieldPath}
                    icon={"pencil"}
                    label={i18next.t("Details")}
                  />
                }
                editorConfig={{
                  removePlugins: [
                    "Image",
                    "ImageCaption",
                    "ImageStyle",
                    "ImageToolbar",
                    "ImageUpload",
                    "MediaEmbed",
                    "Table",
                    "TableToolbar",
                    "TableProperties",
                    "TableCellProperties",
                  ],
                }}
              />
            </Modal.Content>
            <Modal.Actions>
              {!userIsAuthenticated ? (
                <Grid>
                  <Grid.Row>
                    <Grid.Column textAlign={"center"}>
                      <Message info>
                        <Message.Header>
                          {i18next.t(
                            "Do you want to request a training session? You need to log in first",
                          )}
                        </Message.Header>
                        <Trans>
                          <p>
                            Click <a href={"/signup"}>here</a> to register now
                            or <a href={"/login"}>Login</a>{" "}
                          </p>
                        </Trans>
                      </Message>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              ) : (
                <Button
                  positive
                  content={i18next.t("Submit request")}
                  labelPosition={"left"}
                  icon={"checkmark"}
                  type={"submit"}
                  disabled={!userIsAuthenticated}
                  onClick={(event) => {
                    if (userIsAuthenticated) {
                      handleSubmit(event);
                    }
                  }}
                />
              )}
            </Modal.Actions>
          </Modal>
        );
      }}
    </Formik>
  );
};

RequestTrainingModal.propTypes = {
  userIsAuthenticated: PropTypes.bool.isRequired,
  record: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
