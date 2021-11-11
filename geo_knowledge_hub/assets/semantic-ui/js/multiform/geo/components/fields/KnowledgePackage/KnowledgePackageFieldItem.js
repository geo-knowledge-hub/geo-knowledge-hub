// This file is adapted from React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button, List, Ref } from 'semantic-ui-react';
import _truncate from 'lodash/truncate';
import { KnowledgePackageSelectorModal } from './KnowledgePackageSelectorModal';

export const KnowledgePackageFieldItem = ({
  compKey,
  index,
  initialKnowledgePackage,
  knowledgePackageDescription,
  knowledgePackageTitle,
  moveKnowledgePackage,
  replaceKnowledgePackage,
  replaceUIKnowledgePackage,
  removeKnowledgePackage,
  removeUIKnowledgePackage,
  searchConfig,
  serializeKnowledgePackage,
  link,
}) => {
  const dropRef = React.useRef(null);
  const [_, drag, preview] = useDrag({
    item: { index, type: 'knowledgePackage' },
  });
  const [{ hidden }, drop] = useDrop({
    accept: 'knowledgePackage',
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      if (monitor.isOver({ shallow: true })) {
        moveKnowledgePackage(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      hidden: monitor.isOver({ shallow: true }),
    }),
  });

  // Initialize the ref explicitely
  drop(dropRef);
  return (
    <Ref innerRef={dropRef} key={compKey}>
      <List.Item
        key={compKey}
        className={
          hidden ? 'deposit-drag-listitem hidden' : 'deposit-drag-listitem'
        }
      >
        <List.Content floated="right">
          <KnowledgePackageSelectorModal
            searchConfig={searchConfig}
            onPackageChange={(selectedKnowledgePackage) => {
              replaceUIKnowledgePackage(index, selectedKnowledgePackage);
              replaceKnowledgePackage(index, selectedKnowledgePackage);
            }}
            action="edit"
            trigger={
              <Button size="mini" primary type="button">
                {'Edit'}
              </Button>
            }
            serializeKnowledgePackage={serializeKnowledgePackage}
            initialKnowledgePackage={initialKnowledgePackage}
          />
          <Button
            size="mini"
            type="button"
            onClick={() => {
              removeUIKnowledgePackage(index);
              removeKnowledgePackage(index);
            }}
          >
            {'Remove'}
          </Button>
        </List.Content>
        <Ref innerRef={drag}>
          <List.Icon name="bars" className="drag-anchor" />
        </Ref>
        <Ref innerRef={preview}>
          <List.Content>
            <List.Header>{knowledgePackageTitle}</List.Header>
            {knowledgePackageDescription && (
              <List.Description>
                <div dangerouslySetInnerHTML={{ __html: _truncate(knowledgePackageDescription, { length: 300 }) }} />
              </List.Description>
            )}
            {link && (
              <span>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {knowledgePackageDescription && <span>&nbsp;</span>}
                  {'Read more'}
                </a>
              </span>
            )}
          </List.Content>
        </Ref>
      </List.Item>
    </Ref>
  );
};
