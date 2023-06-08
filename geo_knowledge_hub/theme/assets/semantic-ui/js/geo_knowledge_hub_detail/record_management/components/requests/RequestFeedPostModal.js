/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import * as Yup from "yup";
import { Formik } from "formik";
import { FieldLabel, RichInputField, http } from "react-invenio-forms";

import { Trans } from "react-i18next";
import { Button, Dropdown, Grid, Message, Modal } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Button to create a request
 */
export const RequestFeedPostModal = ({ record, open, handleClose }) => {
  // States
  const [hasRequestError, setRequestError] = useState(false);

  // Auxiliary functions
  const onSubmit = (props) => {
    // Preparing data to create the feed post request
    const recordId = record.id;
    const recordFeedUrl = record.links.feed;
    const recordApiUrl = record.links.self;

    // Creating the request
    http
      .put(recordFeedUrl, {
        topic: {
          package_record: recordId,
        },
        type: "feed-post-creation",
      })
      .then((createRequestResponse) => {
        const feedRequestSubmissionUrl = `${recordApiUrl}/actions/submit-feed`;

        // Submitting request
        http
          .post(feedRequestSubmissionUrl, props)
          .then((submitRequestResponse) => {
            // Preparing data
            const requestId = submitRequestResponse.data.id;

            // Sending user to the request page
            window.location.href = `/me/requests/${requestId}`;
          })
          .catch((error) => {
            setRequestError(true);
          });
      })
      .catch((error) => {
        setRequestError(true);
      });
  };

  // Configurations
  const initialValues = {
    payload: {
      content: "",
      format: "html",
    },
  };

  const learnMoreOptions = [
    {
      key: "CMS",
      text: "Learn about the GEO Knowledge Hub Feed",
      value: "CMS",
      onClick: () => {
        window.open(
          "/feed/introducing-the-geo-knowledge-hub-feed",
          "_blank"
        );
      },
    }
  ];

  const validationSchema = Yup.object().shape({
    payload: Yup.object().shape({
      content: Yup.string().required(
        "Please, provide some details around your Knowledge Package"
      ),
      format: Yup.string().required(),
    }),
  });

  const descriptionFieldPath = "payload.content";

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
          <Modal centered closeIcon open={open} onClose={handleClose}>
            <Modal.Header>Request: Feed post</Modal.Header>
            <Modal.Content>
              {hasRequestError && (
                <Message negative>
                  <Message.Header>
                    There was a problem to process your request
                  </Message.Header>
                  <p>Please try again later.</p>
                </Message>
              )}
              <Message
                icon={"bullhorn"}
                header={i18next.t(
                  "We'd love to help you share your Knowledge Package!"
                )}
                content={
                  <div className={"mt-10"}>
                    <Trans>
                      By making this request, your package will be presented on
                      the{" "}
                      <a href={"/feed"} target={"_blank"}>
                        Feed
                      </a>
                      , a place where the community can stay updated about the
                      content available on the GEO Knowledge
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
                    label={i18next.t("Request Details")}
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
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8} textAlign="left">
                    <Dropdown
                      button
                      className="icon"
                      labeled
                      icon="info circle"
                      options={learnMoreOptions}
                      text="Learn More"
                    />
                  </Grid.Column>
                  <Grid.Column width={8} textAlign="right">
                    <Button
                      positive
                      content={"Submit Request"}
                      labelPosition={"left"}
                      icon={"checkmark"}
                      type={"submit"}
                      onClick={(event) => {
                        handleSubmit(event);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Actions>
          </Modal>
        );
      }}
    </Formik>
  );
};

RequestFeedPostModal.propTypes = {
  record: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
