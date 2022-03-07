// This file is part of InvenioRDM
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from "react";
import {
    Button,
    Icon,
    Item,
    Label,
} from "semantic-ui-react";
import _get from "lodash/get";
import _truncate from "lodash/truncate";

import {
    Error,
    EmptyResults,
    ResultsLoader,
    ResultsList
} from 'react-searchkit';

import { i18next } from "@translations/invenio_app_rdm/i18next";


export const ResultLoader = () => {
    return (
        <ResultsLoader>
            <EmptyResults />
            <Error />
            <ResultsList />
        </ResultsLoader>
    );
};

export const RDMRecordResultsListItem = ({ result, index }) => {

    if (!result.is_published) { // temporary workaround ?
        return (<div></div>);
    }

    const access_status_id = _get(result, "ui.access_status.id", "open");
    const access_status = _get(result, "ui.access_status.title_l10n", "Open");
    const access_status_icon = _get(result, "ui.access_status.icon", "unlock");
    const createdDate = _get(
        result,
        "ui.created_date_l10n_long",
        "No creation date found."
    );
    const creators = result.ui.creators.creators.slice(0, 3);

    const description_stripped = _get(
        result,
        "ui.description_stripped",
        "No description"
    );

    const publicationDate = _get(
        result,
        "ui.publication_date_l10n_long",
        "No publication date found."
    );
    const resource_type = _get(
        result,
        "ui.resource_type.title_l10n",
        "No resource type"
    );
    const subjects = _get(result, "ui.subjects", []);
    const title = _get(result, "metadata.title", "No title");
    const version = _get(result, "ui.version", null);

    // Derivatives
    const viewLink = `/records/${result.id}`;
    return (
        <Item key={index} href={viewLink}>
            <Item.Content>
                <Item.Extra className="labels-actions">
                    <Label size="tiny" color="blue">
                        {publicationDate} ({version})
                    </Label>
                    <Label size="tiny" color="grey">
                        {resource_type}
                    </Label>
                    <Label size="tiny" className={`access-status ${access_status_id}`}>
                        {access_status_icon && (
                            <i className={`icon ${access_status_icon}`}></i>
                        )}
                        {access_status}
                    </Label>
                    <Button compact size="small" floated="right">
                        <Icon name="edit" />
                        {i18next.t('Edit')}
                    </Button>
                </Item.Extra>
                <Item.Header>{title}</Item.Header>
                <Item.Meta>
                    {creators.map((creator, index) => (
                        <span key={index}>
                            {_get(creator, "person_or_org.identifiers", []).some(
                                (identifier) => identifier.scheme === "orcid"
                            ) && (
                                    <img className="inline-orcid" src="/static/images/orcid.svg" />
                                )}
                            {creator.person_or_org.name}
                            {index < creators.length - 1 && ","}
                        </span>
                    ))}
                </Item.Meta>
                <Item.Description>
                    {_truncate(description_stripped, { length: 350 })}
                </Item.Description>
                <Item.Extra>
                    {subjects.map((subject, index) => (
                        <Label key={index} size="tiny">
                            {subject.title_l10n}
                        </Label>
                    ))}
                    {createdDate && (
                        <div>
                            <small>
                                {i18next.t('Uploaded on')} <span>{createdDate}</span>
                            </small>
                        </div>
                    )}
                </Item.Extra>
            </Item.Content>
        </Item>
    );
};
