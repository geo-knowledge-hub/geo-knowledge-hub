/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { connect, Provider } from "react-redux";

import { withState } from "react-searchkit";

import { layoutResourcesFinishUpdateResourceList } from "../../../../../state/operations/layout";

/**
 * Modal refresher component.
 *
 * (Initial approach)
 */
class SearchRefresherComponent extends Component {
  render() {
    // Props (Search component)
    const { currentQueryState, updateQueryState } = this.props;

    // Props (Layout)
    const {
      stateUpdateResourceList,
      dispatchLayoutResourcesFinishUpdateResourceList,
    } = this.props;

    if (stateUpdateResourceList) {
      setTimeout(() => {
        updateQueryState(currentQueryState);
        dispatchLayoutResourcesFinishUpdateResourceList();
      }, 300);
    }

    return <></>;
  }
}

const mapStateToProps = (state) => ({
  stateUpdateResourceList: state.layoutResources.resourceListUpdate,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLayoutResourcesFinishUpdateResourceList: () => {
    dispatch(layoutResourcesFinishUpdateResourceList());
  },
});

export const SearchRefresher = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchRefresherComponent);

export const SearchRefresherHOC = (store) => {
  const Component = ({ ...args }) => (
    <Provider store={store}>
      <SearchRefresher {...args} />
    </Provider>
  );

  return withState(Component);
};
