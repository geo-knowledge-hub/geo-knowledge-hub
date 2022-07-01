/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

export class DepositConfigHandler {
  constructor(props) {
    this.props = props;
    this.config = props.config || {};

    this.config["canHaveMetadataOnlyRecords"] = true;

    // check if files are present
    this.noFiles = false;
    if (
      !Array.isArray(this.props.files.entries) ||
      (!this.props.files.entries.length && this.props.record.is_published)
    ) {
      this.noFiles = true;
    }
  }

  accordionStyle = {
    header: { className: "inverted brand", style: { cursor: "pointer" } },
  };
}
