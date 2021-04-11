import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import styled from 'styled-components';
import EntriesList from './EntriesList';
import EntryDetails from './EntryDetails';
import GroupsList from './GroupsList';

const GridWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const VaultUI = () => {
  return (
    <GridWrapper>
      <SplitterLayout primaryIndex={1} secondaryInitialSize={300}>
        <GroupsList />
        <SplitterLayout primaryIndex={1} secondaryInitialSize={300}>
          <EntriesList />
          <EntryDetails />
        </SplitterLayout>
      </SplitterLayout>
    </GridWrapper>
  );
};

export default VaultUI;
