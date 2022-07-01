/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";

import _get from "lodash/get";
import _truncate from "lodash/truncate";
import _camelCase from "lodash/camelCase";

import { Button, Icon, Modal } from "semantic-ui-react";

import { axiosWithconfig } from "@invenio-app-rdm/utils";
import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Delete Draft Button.
 */
export const DeleteDraftButton = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);

  const handleClose = () => setModalOpen(false);

  const handleDelete = async () => {
    const resp = await axiosWithconfig.delete(
      `/api/records/${props.record.id}/draft`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    handleClose();
    window.location.reload();
  };

  return (
    <>
      <Button
        compact
        size="small"
        floated="right"
        color="red"
        onClick={handleOpen}
      >
        <Icon name="trash alternate outline" />
        {i18next.t("Delete")}
      </Button>

      <Modal open={modalOpen} onClose={handleClose} size="tiny">
        <Modal.Content>
          <h3>{i18next.t("Are you sure you want to delete this draft?")}</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClose} floated="left">
            {i18next.t("Cancel")}
          </Button>
          <Button color="red" onClick={handleDelete}>
            {i18next.t("Delete")}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
