/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

// This file is adapted from InvenioRDM source code to improve the interface
// of the GEO Knowledge Hub.

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Icon,
  Message,
  Placeholder,
  List,
  Dropdown,
} from "semantic-ui-react";

import styled from "@emotion/styled";
import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Constants
 */
const NUMBER_OF_VERSIONS = 5;

/**
 * Styled components
 */
const DateDiv = styled.div`
  color: gray;
  font-size: 10px;
  font-weight: bold;
`;

const deserializeRecord = (record) => ({
  id: record.id,
  parent_id: record.parent.id,
  publication_date: record.ui.publication_date_l10n_medium,
  version: record.ui.version,
  links: record.links,
  pids: record.pids,
});

const RecordVersionDropdown = ({
  options,
  defaultValue,
  ...dropdownOptions
}) => {
  return (
    <Dropdown
      fluid
      selection
      search
      options={options}
      defaultValue={defaultValue}
      onChange={(_, data) => {
        document.location.href = data.value;
      }}
      {...dropdownOptions}
    />
  );
};

const PlaceholderLoader = ({ size = NUMBER_OF_VERSIONS }) => {
  const PlaceholderItem = () => (
    <Placeholder.Header>
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Header>
  );
  let numberOfHeader = [];
  for (let i = 0; i < size; i++) {
    numberOfHeader.push(<PlaceholderItem key={i} />);
  }

  return <Placeholder>{numberOfHeader}</Placeholder>;
};

const PreviewMessage = () => {
  return (
    <Grid className="preview-message">
      <Grid.Row>
        <Grid.Column className="versions-preview-info">
          <Message info>
            <Message.Header>
              <Icon name="eye" />
              {i18next.t("Preview")}
            </Message.Header>
            <p>{i18next.t("Preview mode does not display versions.")}</p>
          </Message>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const RecordVersionsList = (props) => {
  const record = deserializeRecord(props.record);
  const { isPreview } = props;
  const recid = record.id;
  const [loading, setLoading] = useState(true);
  const [recordVersions, setRecordVersions] = useState({});

  useEffect(() => {
    async function fetchVersions() {
      const result = await axios(
        `${record.links.versions}?size=${NUMBER_OF_VERSIONS}&sort=version&allversions=true`,
        {
          headers: {
            Accept: "application/vnd.inveniordm.v1+json",
          },
          withCredentials: true,
        },
      );
      let { hits, total } = result.data.hits;
      hits = hits.map(deserializeRecord);
      setRecordVersions({ hits, total });
      setLoading(false);
    }
    fetchVersions();
  }, []);

  return loading ? (
    <>{isPreview ? <PreviewMessage /> : <PlaceholderLoader />}</>
  ) : (
    <List divided>
      {isPreview ? <PreviewMessage /> : null}

      {!isPreview ? (
        <RecordVersionDropdown
          options={recordVersions.hits.map((item) => ({
            key: item.id,
            value: item.id,
            text: (
              <>
                <b>{`${i18next.t("Version")} ${item.version}`}</b>{" "}
                <DateDiv>{`(${item.publication_date})`}</DateDiv>
              </>
            ),
          }))}
          defaultValue={recid}
        />
      ) : null}
    </List>
  );
};
