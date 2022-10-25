/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";

import { Modal, Segment, Button, Grid } from "semantic-ui-react";

import { i18next } from "@translations/geo_knowledge_hub/i18next";

/**
 * Modal component to confirm actions.
 */
export const ConfirmationModal = ({
  open,
  title,
  content,
  onAccept,
  onRefuse,
  onClose,
  ...uiProps
}) => {
  return (
    <Modal
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      open={open}
      closeOnEscape
      closeOnDimmerClick
      centered={false}
      {...uiProps}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Row centered verticalAlign="center">
            <Segment size={"big"} basic>
              <p>{content}</p>
            </Segment>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={(e) => {
            if (onRefuse) {
              onRefuse(e);
            }
          }}
          negative
        >
          {i18next.t("No")}
        </Button>
        <Button
          onClick={(e) => {
            if (onAccept) {
              onAccept(e);
            }
          }}
          positive
        >
          {i18next.t("Yes")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
