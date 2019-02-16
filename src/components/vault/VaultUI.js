import React from 'react';
import styled from 'styled-components';
import GroupsList from './GroupsList';
import EntriesList from './EntriesList';
import EntryDetailsView from './EntryDetails';

const EntryDetails = styled(EntryDetailsView)`
  flex-grow: 2;
`;
const VaultContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

export default () => {
  return (
    <VaultContainer>
      <GroupsList />
      <EntriesList />
      <EntryDetails />
    </VaultContainer>
  );
};
