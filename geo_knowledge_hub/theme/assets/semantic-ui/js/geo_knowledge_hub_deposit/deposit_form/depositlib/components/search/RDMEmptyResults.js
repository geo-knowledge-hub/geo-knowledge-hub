/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import {Icon, Button, Segment, Header, Divider} from "semantic-ui-react";

export const RDMEmptyResults = (props) => {
  const queryString = props.queryString;
  return queryString === "" ? (
    <Segment.Group>
      <Segment placeholder textAlign="center" padded="very">
        <Header as="h1" align="center">
          <Header.Content>
            Get started!
            <Header.Subheader>Make your first upload!</Header.Subheader>
          </Header.Content>
        </Header>
        <Divider hidden/>
        <Button
          color="green"
          icon="upload"
          floated="right"
          href="/uploads/new"
          content="New upload"
        />
      </Segment>
    </Segment.Group>
  ) : (
    <Segment placeholder textAlign="center">
      <Header icon>
        <Icon name="search"/>
        No results found!
      </Header>
    </Segment>
  );
};
