/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { Grid, Header, Icon, Segment } from "semantic-ui-react";

import { i18next } from "@translations/invenio_app_rdm/i18next";

/**
 * Search `No Results` Component for the Resource Layout.
 * @param {str} queryString Query String used to perform the search.
 * @param {str} searchPath Search path used to perform the search.
 * @constructor
 */
export const ResourceFormNoResults = ({ queryString, searchPath }) => {
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={12} textAlign="center" style={{ marginTop: "5%" }}>
          <Segment basic size="massive">
            <div>
              <Icon name={"boxes"} size={"huge"} />
            </div>

            <Header as="h2">
              {queryString.trim()
                ? i18next.t(
                    "We couldn't find any matches for your search query"
                  )
                : i18next.t("This package don't have associated resources yet")}
            </Header>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
