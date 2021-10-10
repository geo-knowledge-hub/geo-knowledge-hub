// This file is adapted from React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import _get from 'lodash/get';
import { FastField } from 'formik';
import { withState } from 'react-searchkit';
import { Item, Header, Radio, Image } from 'semantic-ui-react';

import { KNOWLEDGE_PACKAGE } from '../../resources/types';

export const KnowledgePackageResults = withState(
  ({ currentResultsState: results, serializeKnowledgePackage }) => {
    const serializeKnowledgePackageResult = serializeKnowledgePackage
      ? serializeKnowledgePackage
      : (result) => ({
        // Fixed knowledge package relation
        "identifier": result.pids.doi.identifier,
        "relation_type": "ispartof",
        "resource_type": "knowledge",
        "scheme": "doi"
      });
    return (
      <FastField name="selectedKnowledgePackage">
        {({ form: { values, setFieldValue } }) => (
          <Item.Group>
            {results.data.hits.map((result) => {
              // ToDo: Find a solution that uses less client/server resources.
              if (result.metadata.resource_type.title.en !== KNOWLEDGE_PACKAGE) return;

              const title = result["metadata"]['title'];
              const description = result["metadata"]['description'];
              const identifier = result["pids"]["doi"]["identifier"];

              return (
                <Item
                  key={identifier}
                  onClick={() =>
                    setFieldValue(
                      'selectedKnowledgePackage',
                      serializeKnowledgePackageResult(result)
                    )
                  }
                  className="license-item"
                >
                  <Image ui={false} className="license-radiobox" centered>
                    <Radio
                      checked={_get(values, 'selectedKnowledgePackage.identifier') === identifier}
                      onChange={() =>
                        setFieldValue(
                          'selectedKnowledgePackage',
                          serializeKnowledgePackageResult(result)
                        )
                      }
                    />
                  </Image>
                  <Item.Content className="license-item-content">
                    <Header size="small">{title}</Header>
                    <Item.Description className="license-item-description">
                      <div dangerouslySetInnerHTML={{ __html: description }} />
                    </Item.Description>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>
        )}
      </FastField>
    );
  }
);
