import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import { NonIdealState } from '@blueprintjs/core';
import Entry from './Entry';
import { useCurrentEntries, useGroups } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import AddEntry from './AddEntry';
import { VaultContext } from './Vault';
import { useTranslations } from '../../hooks/i18n';
import { copyToClipboard } from '../../utils';

const EntriesList = ({ className }) => {
  const t = useTranslations();
  const {
    entries,
    selectedEntryID,
    onSelectEntry,
    filters,
    onEntriesFilterTermChange,
    onEntriesFilterSortModeChange
  } = useCurrentEntries();
  const { readOnly } = useContext(VaultContext);
  const { selectedGroupID, trashSelected } = useGroups();
  const ref = useRef(null);
  const currentIndex = entries.findIndex(entry => entry.id === selectedEntryID);
  const keyMap = {
    arrowUp: 'up',
    arrowDown: 'down',
    enter: 'enter',
    copyUsername: 'ctrl+b',
    copyPassword: 'ctrl+c'
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
  const handleCopyField = entryToCopy => {
    if (!entryToCopy) {
      return;
    }

    return copyToClipboard(entryToCopy.value);
  };
  const handlers = {
    arrowUp: event => handleNavigation(event, -1),
    arrowDown: event => handleNavigation(event, 1),
    enter: () => {
      if (document.activeElement !== ref.current) {
        document.activeElement.click();
      }
    },
    copyUsername: () =>
      handleCopyField(entries[currentIndex].fields.find(field => field.title === 'Username')),
    copyPassword: () =>
      handleCopyField(entries[currentIndex].fields.find(field => field.title === 'Password'))
  };

  return (
    <PaneContainer className={className}>
      <PaneHeader
        title={trashSelected ? t('entries-list.trash') : t('entries-list.documents')}
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
            <NonIdealState title={t('entries-list.filters-no-matches')} />
          </When>
          <When condition={entries.length === 0 && trashSelected}>
            <NonIdealState title={t('entries-list.trash-empty')} icon="trash" />
          </When>
          <Otherwise>
            <NonIdealState
              title={t('entries-list.no-entries')}
              description={t('entries-list.create-one-cta')}
              icon="id-number"
            />
          </Otherwise>
        </Choose>
      </PaneContent>
      <PaneFooter>
        <AddEntry disabled={trashSelected || readOnly || !selectedGroupID} />
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
