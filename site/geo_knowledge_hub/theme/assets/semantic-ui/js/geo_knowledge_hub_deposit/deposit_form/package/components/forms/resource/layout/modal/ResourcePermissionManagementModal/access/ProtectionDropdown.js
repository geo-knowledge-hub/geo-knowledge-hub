/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { Field } from "formik";

import { Dropdown } from "semantic-ui-react";

/**
 * Protection component with Dropdown support.
 *
 * @note This component is based on `ProtectionButtons` available on
 *       React Invenio Deposit.
 */
class ProtectionDropdownComponent extends Component {
  constructor(props) {
    super(props);

    this.policyOptions = [
      {
        key: 1,
        text: "Public",
        value: "public",
        onClick: this.handlePublicButtonClick,
      },
      {
        key: 2,
        text: "Restricted",
        value: "restricted",
        onClick: this.handleRestrictionButtonClick,
      },
    ];
  }

  handlePublicButtonClick = () => {
    const { formik, fieldPath } = this.props;
    formik.form.setFieldValue(fieldPath, "public");
    // Tip from React Invenio Deposit:
    //  We reset values, so if embargo filled and click Public,
    //  user needs to fill embargo again. Otherwise, lots of bookkeeping.
    formik.form.setFieldValue("access.embargo", {
      active: false,
    });
  };

  handleRestrictionButtonClick = () => {
    const { formik, fieldPath } = this.props;
    formik.form.setFieldValue(fieldPath, "restricted");
  };

  render() {
    // Props (Formik operation)
    const { formik } = this.props;
    const { disabled } = this.props;

    return (
      <Dropdown
        floating
        fluid={false}
        direction={"right"}
        openOnFocus={false}
        selectOnBlur={false}
        options={this.policyOptions}
        value={formik.field.value}
        disabled={disabled}
      />
    );
  }
}

export const ProtectionDropdown = ({ ...props }) => {
  const { fieldPath } = props;

  return (
    <Field
      name={fieldPath}
      component={(formikProps) => (
        <ProtectionDropdownComponent formik={formikProps} {...props} />
      )}
    />
  );
};
