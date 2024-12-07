/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Step, Icon } from "semantic-ui-react";

import { i18next } from "@translations/geo_knowledge_hub/i18next";

import { LayoutFormTypes } from "./LayoutFormTypes";
import { layoutChangeActiveForm } from "../../state/operations/layout";

export const PackageFormActivatorComponent = ({
  activatorText,
  activatorIcon,
  layoutChangeActiveForm,
}) => {
  return (
    <Step.Group fluid>
      <Step
        link
        onClick={() => {
          layoutChangeActiveForm();
        }}
      >
        <Icon name={activatorIcon} />
        <Step.Content>
          <Step.Title>{activatorText}</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  );
};

const mapDispatchToProps = (dispatch) => ({
  layoutChangeActiveForm: () =>
    dispatch(layoutChangeActiveForm(LayoutFormTypes.Package)),
});

const mapStateToProps = (state) => ({
  packageRecord: state.storage.packageRecord,
});

export const PackageFormActivator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PackageFormActivatorComponent);

PackageFormActivator.propTypes = {
  activatorText: PropTypes.string.isRequired,
  activatorIcon: PropTypes.string.isRequired,
};

PackageFormActivator.defaultProps = {
  activatorText: i18next.t("Back to package"),
  activatorIcon: "boxes",
};
