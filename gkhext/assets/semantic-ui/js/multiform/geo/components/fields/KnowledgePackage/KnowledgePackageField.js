// This file is adapted from React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { DndProvider } from 'react-dnd';
import React, { Component } from 'react';
import { getIn, FieldArray } from 'formik';
import { FieldLabel } from 'react-invenio-forms';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Form, Icon, List } from 'semantic-ui-react';

import PropTypes from 'prop-types';

import { KnowledgePackageFieldItem } from './KnowledgePackageFieldItem';
import { KnowledgePackageSelectorModal } from './KnowledgePackageSelectorModal';
import _ from 'lodash';

import { InvenioSearchApi } from 'react-searchkit';


class KnowledgePackageFieldForm extends Component {

  constructor(props) {
    super(props);
    this.state = { knowledgePackages: [] };

    this.queriedPackages = [];
    this.searchApi = new InvenioSearchApi(this.props.searchConfig.searchApi);
  }

  knowledgePackageSearch(knowledgePackageIdentifier) {
    // checking if the knowledge package is already defined on state
    const packageIndex = _.findIndex(this.queriedPackages, (pkgIdentifier) => {
      return pkgIdentifier === knowledgePackageIdentifier
    });

    if (packageIndex !== -1)
      return packageIndex;

    // saving already defined packages
    this.queriedPackages.push(knowledgePackageIdentifier);

    this.searchApi.search({
      filters: [],
      queryString: `pids.doi.identifier: "${knowledgePackageIdentifier}"`
    }).then((result) => {
      this.setState({
        knowledgePackages: [
          ...this.state.knowledgePackages,
          ...result.hits.map(x => ({
            ...x,
            identifier: x.pids.doi.identifier
          }))
        ]
      })
    });
  }

  knowledgePackageSelectHandler(knowledgePackage) {
    this.knowledgePackageSearch(knowledgePackage.identifier);
  }

  bulkKnowledgePackageSearch(knowledgePackagesIdentifiers) {
    const bulkQueryString = knowledgePackagesIdentifiers.map(knowledgePackageIdentifier => {
      // checking if the knowledge package is already defined on state
      const packageIndex = _.findIndex(this.queriedPackages, (pkgIdentifier) => {
        return pkgIdentifier === knowledgePackageIdentifier
      });

      if (packageIndex === -1) {
        this.queriedPackages.push(knowledgePackageIdentifier);
        return `pids.doi.identifier: "${knowledgePackageIdentifier}"`;
      }
    });

    if (!_.isEmpty(_.compact(bulkQueryString))) {
      let queryString = bulkQueryString.join(" OR ");

      this.searchApi.search({
        filters: [],
        queryString: `(${queryString})`
      }).then((result) => {
        this.setState({
          knowledgePackages: [
            ...this.state.knowledgePackages,
            ...result.hits.map(x => ({
              ...x,
              identifier: x.pids.doi.identifier
            }))
          ]
        })
      });
    };
  }

  knowledgePackageResolver(knowledgePackageIdentifier) {
    if (!knowledgePackageIdentifier)
      return null;

    this.knowledgePackageSearch(knowledgePackageIdentifier);

    // checking if package content is already defined
    const packageIndex = _.findIndex(this.state.knowledgePackages, (pkg) => {
      return pkg.identifier === knowledgePackageIdentifier
    });

    if (packageIndex !== -1)
      return this.state.knowledgePackages[packageIndex];
    return null;
  }

  render() {
    const {
      label,
      labelIcon,
      fieldPath,
      form: { values, errors },
      move: formikArrayMove,
      push: formikArrayPush,
      remove: formikArrayRemove,
      replace: formikArrayReplace,
      required,
    } = this.props;

    /**
     * Removes license from UI object
     * @param {number} index
     */
    const removeUIKnowledgePackage = (index) => {
      const uiValues = getIn(values, fieldPath, '');

      _.pullAt(uiValues, index);
    };

    /**
     * Replaces license in UI object
     * @param {number} index
     * @param {Object} selectedKnowledgePackage
     */
    const replaceUIKnowledgePackage = (index, selectedKnowledgePackage) => {
      const uiValues = getIn(values, fieldPath, '');

      const UIserialize = (selectedKnowledgePackage) => {
        const packageContent = this.knowledgePackageResolver(selectedKnowledgePackage.identifier);

        if (!packageContent)
          return null;

        return {
          title_l10n: packageContent.title,
          identifier: selectedKnowledgePackage.identifier,
          description_l10n: selectedKnowledgePackage.description
        };
      };

      uiValues.splice(index, 1, UIserialize(selectedKnowledgePackage));
    };

    if (_.isEmpty(this.queriedPackages))
      this.bulkKnowledgePackageSearch(_.map(getIn(values, fieldPath, []), "identifier"));

    return (
      <DndProvider backend={HTML5Backend}>
        <Form.Field required={required}>
          <FieldLabel
            htmlFor={fieldPath}
            icon={labelIcon}
            label={label}
          ></FieldLabel>
          <List>
            {getIn(values, fieldPath, []).map((value, index, array) => {

              const arrayPath = fieldPath;
              const indexPath = index;
              const key = `${arrayPath}.${indexPath}`;

              // resolving the knowledge package content
              const packageContent = this.knowledgePackageResolver(value.identifier);

              if (!packageContent) // avoiding render problem
                return (<div></div>);

              // extracting knowledge package information
              const title = packageContent.metadata.title;
              const link = packageContent.links.latest_html;
              const description = packageContent.metadata.description;

              return (
                <KnowledgePackageFieldItem
                  key={key}
                  {...{
                    index,
                    link: link,
                    compKey: key,
                    knowledgePackageTitle: title,
                    initialKnowledgePackage: null,
                    searchConfig: this.props.searchConfig,
                    moveKnowledgePackage: formikArrayMove,
                    knowledgePackageDescription: description,
                    removeKnowledgePackage: formikArrayRemove,
                    replaceKnowledgePackage: formikArrayReplace,
                    removeUIKnowledgePackage: removeUIKnowledgePackage,
                    replaceUIKnowledgePackage: replaceUIKnowledgePackage,
                    serializeKnowledgePackage: this.props.serializeKnowledgePackage,
                  }}
                />
              );
            })}

            <KnowledgePackageSelectorModal
              searchConfig={this.props.searchConfig}
              trigger={
                <Button type="button" key="standard">
                  <Icon name="add" />
                  {"Associate to a Knowledge Package"}
                </Button>
              }
              onPackageChange={(selectedKnowledgePackage) => {
                formikArrayPush(selectedKnowledgePackage);
                this.knowledgePackageSelectHandler(selectedKnowledgePackage);
              }}
              action="add"
              serializeKnowledgePackage={this.props.serializeKnowledgePackage}
            />
          </List>
        </Form.Field>
      </DndProvider>
    );
  }
  setOpen = (open) => this.setState({ open });
}

export class KnowledgePackageField extends Component {
  render() {
    return (
      <FieldArray
        name={this.props.fieldPath}
        component={(formikProps) => (
          <KnowledgePackageFieldForm {...formikProps} {...this.props} />
        )}
      />
    );
  }
}

KnowledgePackageField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  searchConfig: PropTypes.object.isRequired,
  required: PropTypes.bool,
  serializeKnowledgePackage: PropTypes.func,
};

KnowledgePackageField.defaultProps = {
  fieldPath: 'metadata.related_identifiers',
  label: 'Associated Knowledge Package',
  uiFieldPath: 'ui.related_identifiers',
  labelIcon: 'drivers license',
  required: true,
};
