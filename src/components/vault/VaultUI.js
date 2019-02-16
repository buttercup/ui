import React from 'react';
import styled from 'styled-components';
import GroupsListView from './GroupsList';
import EntriesListView from './EntriesList';
import EntryDetailsView from './EntryDetails';
import AddEntry from './AddEntry';

const VaultContainer = styled.div`
  width: 100vw;
  height: 90vh;
  display: grid;
  grid-template-columns: 300px 300px 1fr;
  grid-column-gap: 1rem;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'groups   entries   entry'
    '.        actions   .';
`;

const EntryDetails = styled(EntryDetailsView)`
  grid-area: entry;
`;

const GroupsList = styled(GroupsListView)`
  grid-area: groups;
`;

const EntriesList = styled(EntriesListView)`
  grid-area: entries;
`;

const Actions = styled.div`
  grid-area: actions;
`;

export default () => {
  return (
    <VaultContainer>
      <GroupsList />
      <EntriesList />
      <EntryDetails />
      <Actions>
        <AddEntry />
      </Actions>
    </VaultContainer>
  );
};
