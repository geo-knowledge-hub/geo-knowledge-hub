/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";
import { connect, useStore, Provider } from "react-redux";

import { LayoutFormTypes } from "./LayoutFormTypes";
import { PackageFormActivator } from "./PackageFormActivator";
import { ResourceFormActivator } from "./ResourceFormActivator";

import { PackageDepositForm, ResourceDepositForm } from "../forms";

import { DnDContext } from "./context";

export const LayoutFormsComponent = ({ activeFormName }) => {
  // States
  const reduxStore = useStore();

  // Auxiliary functions
  const wrapComponentWithStoreContext = (Component) => (
    <Provider store={reduxStore}>
      <Component />
    </Provider>
  );

  // Components to be rendered as layout menu
  const packageFormActivator =
    wrapComponentWithStoreContext(PackageFormActivator);
  const resourceFormActivator = wrapComponentWithStoreContext(
    ResourceFormActivator
  );

  //  Rendering
  return (
    <DnDContext>
      <div>
        {activeFormName === LayoutFormTypes.Package ? (
          <PackageDepositForm formActivator={resourceFormActivator} />
        ) : (
          <ResourceDepositForm formActivator={packageFormActivator} />
        )}
      </div>
    </DnDContext>
  );
};

const mapStateToProps = (state) => ({
  activeFormName: state.layout.activeFormName,
});

export const LayoutForms = connect(mapStateToProps, null)(LayoutFormsComponent);

LayoutForms.propTypes = {
  activeFormName: PropTypes.string,
};
