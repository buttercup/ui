import React from 'react';
import styled from 'styled-components';
import GroupsList from './GroupsList';
import EntriesListBase from './EntriesList';
import EntryDetails from './EntryDetails';
import AddEntry from './AddEntry';

import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';

import 'react-reflex/styles.css';

const VaultContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Pane = styled(ReflexElement)`
  display: flex;
  flex-direction: column;
`;

const EntriesList = styled(EntriesListBase)`
  flex: 1;
`;

const Actions = styled.div`
  flex: 0;
`;

export default () => {
  return (
    <ReflexContainer orientation="vertical">
      <Pane size={300}>
        <GroupsList />
      </Pane>

      <ReflexSplitter />

      <Pane size={300}>
        <EntriesList />
        <Actions>
          <AddEntry />
        </Actions>
      </Pane>

      <ReflexSplitter />

      <Pane>
        <EntryDetails />
      </Pane>
    </ReflexContainer>
  );
};
