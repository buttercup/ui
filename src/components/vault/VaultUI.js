import React from 'react';
import { ReflexContainer, ReflexSplitter } from 'react-reflex';
import styled from 'styled-components';
import GroupsList from './GroupsList';
import EntriesList from './EntriesList';
import EntryDetails from './EntryDetails';
import { Pane } from './Pane';
import { getThemeProp } from '../../utils';

// const Splitter = styled(ReflexSplitter).attrs({ className: 'reflex-thin' })`
//   background-color: ${props => getThemeProp(props, 'colors.paneDivider')} !important;
// `;

export default () => {
  return (
    <ReflexContainer orientation="vertical">
      <Pane size={300} minSize={200}>
        <GroupsList />
      </Pane>

      <ReflexSplitter className="reflex-thin" />

      <Pane size={300} minSize={200}>
        <EntriesList />
      </Pane>

      <ReflexSplitter className="reflex-thin" />

      <Pane minSize={400} autoGrow>
        <EntryDetails />
      </Pane>
    </ReflexContainer>
  );
};
