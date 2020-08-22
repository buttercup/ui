import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import { NonIdealState } from '@blueprintjs/core';
import Entry from './Entry';
import { useCurrentEntries, useGroups } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import AddEntry from './AddEntry';

const EntriesList = ({ className }) => {
  const {
    entries,
    selectedEntryID,
    onSelectEntry,
    filters,
    onEntriesFilterTermChange,
    onEntriesFilterSortModeChange
  } = useCurrentEntries();
  const { trashSelected } = useGroups();
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
      <PaneHeader
        title={trashSelected ? 'Trash' : 'Documents'}
        count={entries.length}
        filter={filters}
        onTermChange={term => onEntriesFilterTermChange(term)}
        onSortModeChange={sortMode => onEntriesFilterSortModeChange(sortMode)}
      />
      <PaneContent>
        <Choose>
          <When condition={entries.length > 0}>
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
          </When>
          <When condition={entries.length === 0 && filters.term !== ''}>
            <NonIdealState title="Not found" />
          </When>
          <When condition={entries.length === 0 && trashSelected}>
            <NonIdealState title="Trash is empty!" icon="trash" />
          </When>
          <Otherwise>
            <NonIdealState
              title="No Documents"
              description="Why not create one?"
              icon="id-number"
            />
          </Otherwise>
        </Choose>
      </PaneContent>
      <PaneFooter>
        <AddEntry disabled={trashSelected} />
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
