/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import _get from "lodash/get";
import _truncate from "lodash/truncate";

import { FastField } from "formik";

import { withState } from "react-searchkit";
import { connect, Provider } from "react-redux";
import { Item, Radio, Label } from "semantic-ui-react";

import { SearchItemCreators } from "@invenio-app-rdm/utils";

import { i18next } from "@translations/invenio_app_rdm/i18next";

import {
  extractProgrammeActivityAcronym,
  recordTypeLinksFactory,
} from "../../../../../../../../../../utils";

class ResultItemComponent extends Component {
  render() {
    // Props (Deposit store)
    const { statePackageRecord } = this.props;

    // Props (Search operation)
    const { currentResultsState: results, serializeResources } = this.props;

    // Serializer definition
    const serializeSelectedResourceResult = serializeResources
      ? serializeResources
      : (result) => ({
          title: result.metadata.title,
          id: result.id,
        });

    // Preparing the package resources to be used
    const packageResourcesIds =
      statePackageRecord?.relationship?.resources.map(
        (resource) => resource.id
      ) || [];

    return (
      <FastField name="selectedResource">
        {({ form: { values, setFieldValue } }) => (
          <Item.Group>
            {results.data.hits.map((result) => {
              // Extracting information to be rendered
              const recordLinks = recordTypeLinksFactory(
                result.id,
                result.parent.type
              );

              const accessStatusId = _get(
                result,
                "ui.access_status.id",
                "open"
              );
              const accessStatus = _get(
                result,
                "ui.access_status.title_l10n",
                "Open"
              );
              const accessStatusIcon = _get(
                result,
                "ui.access_status.icon",
                "unlock"
              );

              const createdDate = _get(
                result,
                "ui.created_date_l10n_long",
                i18next.t("No creation date found.")
              );

              const creators = _get(result, "ui.creators.creators", []).slice(
                0,
                3
              );

              const descriptionStripped = _get(
                result,
                "ui.description_stripped",
                i18next.t("No description")
              );

              const publicationDate = _get(
                result,
                "ui.publication_date_l10n_long",
                i18next.t("No publication date found.")
              );
              const resourceType = _get(
                result,
                "ui.resource_type.title_l10n",
                i18next.t("No resource type")
              );

              const title = _get(
                result,
                "metadata.title",
                i18next.t("No title")
              );
              const subjects = _get(result, "ui.subjects", []);
              const version = _get(result, "ui.version", null);
              const isPublished = result.is_published;

              const programmeActivityAcronym = extractProgrammeActivityAcronym(
                _get(result, "metadata.geo_work_programme_activity.title.en")
              );

              const viewLink = isPublished
                ? recordLinks.published.ui
                : recordLinks.draft.ui;

              // Defining if result is already imported to
              // the package.
              const isAlreadyImported = packageResourcesIds.includes(result.id);

              return (
                <Item
                  key={title}
                  onClick={() => {
                    if (!isAlreadyImported) {
                      setFieldValue(
                        "selectedResource",
                        serializeSelectedResourceResult(result)
                      );
                    }
                  }}
                  className="deposits-list-item mb-20"
                >
                  <div className="status-icon mr-10">
                    <Item.Content verticalAlign="middle">
                      <Item.Extra>
                        <Radio
                          checked={
                            // Already imported resources can't be selected again
                            !isAlreadyImported &&
                            _get(values, "selectedResource.title") === title
                          }
                          onChange={() => {
                            if (!isAlreadyImported) {
                              setFieldValue(
                                "selectedResource",
                                serializeSelectedResourceResult(result)
                              );
                            }
                          }}
                          disabled={isAlreadyImported}
                        />
                      </Item.Extra>
                    </Item.Content>
                  </div>

                  <Item.Content style={{ cursor: "default" }}>
                    <Item.Extra className="labels-actions">
                      {/* For reduced spacing between labels. */}
                      {isAlreadyImported && (
                        <Label size="tiny" color="green">
                          {i18next.t("Already attached")}
                        </Label>
                      )}
                      {programmeActivityAcronym && (
                        <Label
                          size="tiny"
                          className={"programme-activity-label"}
                        >
                          {programmeActivityAcronym}
                        </Label>
                      )}
                      <Label size="tiny" className="primary">
                        {publicationDate} ({version})
                      </Label>
                      <Label size="tiny" className="neutral">
                        {resourceType}
                      </Label>
                      <Label
                        size="tiny"
                        className={`access-status ${accessStatusId}`}
                      >
                        {accessStatusIcon && (
                          <i className={`icon ${accessStatusIcon}`} />
                        )}
                        {accessStatus}
                      </Label>
                    </Item.Extra>
                    <Item.Header as="h2">
                      <a href={viewLink} target={"_blank"}>
                        {title}
                      </a>
                    </Item.Header>
                    <Item.Meta>
                      <div className="creatibutors">
                        <SearchItemCreators creators={creators} />
                      </div>
                    </Item.Meta>
                    <Item.Description>
                      {_truncate(descriptionStripped, {
                        length: 350,
                      })}
                    </Item.Description>
                    <Item.Extra>
                      {subjects.map((subject) => (
                        <Label key={subject.title_l10n} size="tiny">
                          {subject.title_l10n}
                        </Label>
                      ))}
                      {createdDate && (
                        <div>
                          <small>
                            {i18next.t("Uploaded on")}{" "}
                            <span>{createdDate}</span>
                          </small>
                        </div>
                      )}
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>
        )}
      </FastField>
    );
  }
}

const mapStateToProps = (state) => ({
  statePackageRecord: state.storage.packageObject.record,
});

export const ResultItem = connect(mapStateToProps, null)(ResultItemComponent);

export const ResultItemHOC = (store) => {
  const Component = ({ ...args }) => (
    <Provider store={store}>
      <ResultItem {...args} />
    </Provider>
  );

  return withState(Component);
};
