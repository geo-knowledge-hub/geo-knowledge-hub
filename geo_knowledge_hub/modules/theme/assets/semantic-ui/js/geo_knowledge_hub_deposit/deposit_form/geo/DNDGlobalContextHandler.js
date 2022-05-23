// Adapted from https://github.com/react-dnd/react-dnd/issues/186 (Hooks solution).

import React from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const GlobalDndContext = (props) =>
{
  return <DndProvider backend={HTML5Backend} key={1}>{props.children}</DndProvider>
}

GlobalDndContext.propTypes = { children: PropTypes.node };

export default GlobalDndContext;
