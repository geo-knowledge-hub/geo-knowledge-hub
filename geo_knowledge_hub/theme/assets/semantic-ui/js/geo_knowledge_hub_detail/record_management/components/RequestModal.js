/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";

import { FieldLabel, RichInputField } from "react-invenio-forms";

import { Trans } from "react-i18next";
import { Button, Modal, Divider } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Button to create a request
 */
export const RequestModal = ({
  record,
  open,
  handleClose,
  requestType = "Feed post",
}) => {
  // Auxiliary functions
  const onSubmit = (props) => {
    // ToDo: Handle submission
  };

  // Configurations
  const initialValues = {
    payload: {
      content: "",
      format: "html",
    },
  };

  const descriptionFieldPath = "payload.content";

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ values, resetForm, handleSubmit }) => {
        return (
          <Modal centered={true} open={open} onClose={handleClose}>
            <Modal.Header>{`Request: ${requestType}`}</Modal.Header>
            <Modal.Content>
              <p style={{ fontSize: "16px", textAlign: "justify" }}>
                <Trans>
                  You can request the GEO Knowledge Hub team to publish a
                  captivating and informative post about your meticulously
                  crafted Knowledge Package. This post will be skillfully shared
                  across various platforms, including the highly-engaging GEO
                  social media channels and the prominent GEO Knowledge Hub
                  Feed, reaching a broad audience of enthusiastic readers and
                  followers.
                </Trans>
              </p>
            </Modal.Content>
            <Modal.Content>
              <Divider />
              <RichInputField
                fieldPath={descriptionFieldPath}
                label={
                  <FieldLabel
                    htmlFor={descriptionFieldPath}
                    icon={"pencil"}
                    label={i18next.t("Description")}
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
                required={true}
              />
            </Modal.Content>
            <Modal.Actions>
              <Button
                size={"small"}
                negative
                floated={"left"}
                onClick={handleClose}
              >
                {i18next.t("Cancel")}
              </Button>
              <Button
                size={"small"}
                positive
                onClick={(event) => {
                  handleSubmit(event);
                }}
              >
                {i18next.t("Request")}
              </Button>
            </Modal.Actions>
          </Modal>
        );
      }}
    </Formik>
  );
};

RequestModal.propTypes = {
  record: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
