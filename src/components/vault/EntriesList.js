import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import Entry from './Entry';
import { useCurrentEntries } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import AddEntry from './AddEntry';

const EntriesList = ({ className }) => {
  const { entries, selectedEntryID, onSelectEntry } = useCurrentEntries();
  const ref = useRef(null);
  const currentIndex = entries.findIndex(entry => entry.id === selectedEntryID);
  const keyMap = {
    arrowUp: 'up',
    arrowDown: 'down',
    enter: 'enter'
  };
  const handleNavigation = (event, step) => {
    event.preventDefault();
    const nextEntryID =
      step < 0
        ? entries[currentIndex === 0 ? entries.length - 1 : currentIndex - 1]
        : entries[(currentIndex + 1) % entries.length];
    onSelectEntry(nextEntryID.id);
    if (ref.current) {
      ref.current.focus();
    }
  };
  const handlers = {
    arrowUp: event => handleNavigation(event, -1),
    arrowDown: event => handleNavigation(event, 1),
    enter: event => {
      if (document.activeElement !== ref.current) {
        document.activeElement.click();
      }
    }
  };

  return (
    <PaneContainer className={className}>
      <PaneHeader title="Documents" count={entries.length} />
      <PaneContent>
        <HotKeys keyMap={keyMap} handlers={handlers} tabIndex={1}>
          <For each="entry" of={entries} index="entryIndex">
            <Entry
              tabIndex={entryIndex + 2}
              entry={entry}
              key={entry.id}
              onClick={e => onSelectEntry(entry.id)}
              selected={selectedEntryID === entry.id}
              innerRef={el => {
                if (selectedEntryID === entry.id) {
                  ref.current = el;
                }
              }}
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
