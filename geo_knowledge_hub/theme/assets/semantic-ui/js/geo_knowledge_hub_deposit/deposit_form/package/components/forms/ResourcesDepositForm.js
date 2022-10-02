/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from "react";

import { Grid } from "semantic-ui-react";
import { SearchApp } from "@js/invenio_search_ui/components";

import { ResourceFormContext } from "../../context";
import { ResourceModal } from "../modals";

export const ResourcesDepositForm = ({ headerSelector, ...props }) => {
  const [modalState, setModalState] = useState({
    open: false,
    record: null,
    config: null,
  });
  const [searchState, setSearchState] = useState({ updateSearch: false });

  // Configuring the state provided to the component three
  const contextState = {
    ...props,
    modal: {
      state: modalState,
      setState: setModalState,
    },
    search: {
      state: searchState,
      setState: setSearchState,
    },
    header: headerSelector,
  };

  return (
    <>
      <Grid className="mt-9" centered>
        <Grid.Column mobile={16} tablet={16} computer={16}>
          <ResourceFormContext.Provider value={contextState}>
            <SearchApp config={props.configRecordSearch} />

            <ResourceModal
              isModalOpen={modalState.open}
              onClose={() => {
                setModalState({ ...modalState, open: false });
              }}
              {...modalState}
            />
          </ResourceFormContext.Provider>
        </Grid.Column>
      </Grid>
    </>
  );
};
