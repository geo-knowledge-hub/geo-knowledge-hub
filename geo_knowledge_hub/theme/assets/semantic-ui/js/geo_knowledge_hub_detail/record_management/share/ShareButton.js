// This file is part of InvenioRDM
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from "react";
import PropTypes from "prop-types";

import { Icon, Button, Popup } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { ShareModal } from "./ShareModal";


export const ShareButton = ({ disabled, record }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <Popup
        content={i18next.t("You don't have permissions to share this record.")}
        disabled={!disabled}
        trigger={
          <Button
            fluid
            onClick={handleOpen}
            disabled={disabled}
            primary
            size="medium"
            aria-haspopup="dialog"
            icon
            labelPosition="left"
          >
            <Icon name="share square" />
            {i18next.t("Share")}
          </Button>
        }
      />
      <ShareModal open={modalOpen} handleClose={handleClose} record={record} />
    </>
  );
};

ShareButton.propTypes = {
  disabled: PropTypes.bool,
  record: PropTypes.object.isRequired,
};

ShareButton.defaultProps = {
  disabled: false,
};
