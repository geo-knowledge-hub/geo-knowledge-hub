/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2024 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import { FieldLabel, TextField } from "react-invenio-forms";

export class MarketplaceVendorContact extends Component {
  render() {
    const { fieldPath, options, label, icon, required, recordUI } = this.props;

    return (
      <TextField
        fieldPath={fieldPath}
        label={<FieldLabel htmlFor={fieldPath} icon={icon} label={label} />}
        required={required}
        helpText={i18next.t(
          "Support e-mail for the application, available for queries and assistance."
        )}
        optimized
      />
    );
  }
}

export class MarketplaceLaunch extends Component {
  render() {
    const { fieldPath, options, label, icon, required, recordUI } = this.props;

    return (
      <TextField
        fieldPath={fieldPath}
        label={<FieldLabel htmlFor={fieldPath} icon={icon} label={label} />}
        required={required}
        helpText={i18next.t(
          "Direct link to quickly access/launch/use the application (e.g., service URL, magnet link)."
        )}
        optimized
      />
    );
  }
}

//
// PropTypes definition
//
const propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  icon: PropTypes.string,
  required: PropTypes.bool,
  recordUI: PropTypes.object,
};

MarketplaceLaunch.propTypes = propTypes;
MarketplaceVendorContact.propTypes = propTypes;

MarketplaceLaunch.defaultProps = {
  fieldPath: "metadata.marketplace.launch_url",
  label: i18next.t("Launch URL"),
  icon: "rocket",
  required: true,
  recordUI: undefined,
};

MarketplaceVendorContact.defaultProps = {
  fieldPath: "metadata.marketplace.vendor_contact",
  label: i18next.t("Vendor contact"),
  icon: "mail",
  required: true,
  recordUI: undefined,
};
