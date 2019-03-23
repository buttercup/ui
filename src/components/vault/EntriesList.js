import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Entry from './Entry';
import { useCurrentEntries } from './hooks/vault';

const EntriesContainer = styled.div``;
const Entries = styled.div`
  padding: 0.5rem;
`;

const EntriesList = ({ className }) => {
  const { entries, selectedEntryID, onSelectEntry } = useCurrentEntries();

  return (
    <EntriesContainer className={className}>
      <Entries>
        <For each="entry" of={entries} index="entryIndex">
          <Entry
            entry={entry}
            key={entry.id}
            onClick={e => onSelectEntry(entry.id)}
            selected={selectedEntryID === entry.id}
          />
        </For>
      </Entries>
    </EntriesContainer>
  );
};

EntriesList.propTypes = {
  className: PropTypes.string
};

EntriesList.defaultProps = {
  className: null
};

export default EntriesList;
