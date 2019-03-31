import React from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import Entry from './Entry';
import { useCurrentEntries } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import AddEntry from './AddEntry';

const EntriesList = ({ className }) => {
  const { entries, selectedEntryID, onSelectEntry } = useCurrentEntries();
  const currentIndex = entries.findIndex(entry => entry.id === selectedEntryID);
  const keyMap = {
    arrowUp: 'up',
    arrowDown: 'down'
  };
  const handlers = {
    arrowUp: event => {
      event.preventDefault();
      const nextEntryID = entries[currentIndex === 0 ? entries.length - 1 : currentIndex - 1];
      onSelectEntry(nextEntryID.id);
    },
    arrowDown: event => {
      event.preventDefault();
      const nextEntryID = entries[(currentIndex + 1) % entries.length];
      onSelectEntry(nextEntryID.id);
    }
  };

  return (
    <PaneContainer className={className}>
      <PaneHeader title="Documents" count={entries.length} />
      <PaneContent>
        <HotKeys keyMap={keyMap} handlers={handlers}>
          <For each="entry" of={entries} index="entryIndex">
            <Entry
              entry={entry}
              key={entry.id}
              onClick={e => onSelectEntry(entry.id)}
              selected={selectedEntryID === entry.id}
            />
          </For>
        </HotKeys>
      </PaneContent>
      <PaneFooter>
        <AddEntry />
      </PaneFooter>
    </PaneContainer>
  );
};

EntriesList.propTypes = {
  className: PropTypes.string
};

EntriesList.defaultProps = {
  className: null
};

export default EntriesList;
