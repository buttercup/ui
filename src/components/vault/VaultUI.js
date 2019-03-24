import React from 'react';
import styled from 'styled-components';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import GroupsList from './GroupsList';
import EntriesListBase from './EntriesList';
import EntryDetails from './EntryDetails';
import AddEntry from './AddEntry';

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
  padding: 0.5rem;
  border-top: 1px solid ${p => p.theme.colors.divider};
`;

export default () => {
  return (
    <ReflexContainer orientation="vertical">
      <Pane size={300}>
        <GroupsList />
      </Pane>

      <ReflexSplitter className="reflex-thin" />

      <Pane size={300}>
        <EntriesList />
        <Actions>
          <AddEntry />
        </Actions>
      </Pane>

      <ReflexSplitter className="reflex-thin" />

      <Pane>
        <EntryDetails />
      </Pane>
    </ReflexContainer>
  );
};
