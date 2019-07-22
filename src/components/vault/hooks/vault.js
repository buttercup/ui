import { useContext } from 'react';
import { VaultContext } from '../Vault';
import { filterNestedGroups, getNestedGroups, isTrashGroup, sortGroups } from '../utils/groups';
import { filterEntries, sortEntries } from '../utils/entries';

export function useCurrentEntry() {
  const {
    editingEntry,
    selectedEntry,
    onDeleteEntry,
    onAddField,
    onCancelEdit,
    onEdit,
    onFieldNameUpdate,
    onFieldUpdate,
    onFieldSetValueType,
    onRemoveField,
    onSaveEdit
  } = useContext(VaultContext);

  return {
    entry: editingEntry || selectedEntry,
    editing: Boolean(editingEntry),
    onDeleteEntry,
    onAddField,
    onCancelEdit,
    onEdit,
    onFieldNameUpdate,
    onFieldUpdate,
    onFieldSetValueType,
    onRemoveField,
    onSaveEdit
  };
}

export function useCurrentEntries() {
  const {
    currentEntries,
    onSelectEntry,
    selectedEntryID,
    entriesFilters,
    onEntriesFilterTermChange,
    onEntriesFilterSortModeChange
  } = useContext(VaultContext);
  const { sortMode } = entriesFilters;
  const entries =
    sortMode === 'na' ? currentEntries : sortEntries(currentEntries, sortMode === 'az');

  return {
    entries: filterEntries(entries, entriesFilters.term),
    onSelectEntry,
    selectedEntryID,
    filters: entriesFilters,
    onEntriesFilterTermChange,
    onEntriesFilterSortModeChange
  };
}

export function useGroups() {
  const {
    vault,
    onSelectGroup,
    onMoveEntryToGroup,
    selectedGroupID,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup,
    groupFilters,
    onGroupFilterTermChange,
    onGroupFilterSortModeChange
  } = useContext(VaultContext);

  const trashGroup = vault.groups.find(isTrashGroup);
  const trashID = trashGroup && trashGroup.id;
  const trashSelected = selectedGroupID === trashID;
  const trashCount = vault.entries.filter(entry => entry.parentID === trashID).length;
  const onMoveEntryToTrash = entryID => onMoveEntryToGroup(entryID, trashID);

  return {
    groups: filterNestedGroups(
      getNestedGroups(
        sortGroups(vault.groups, groupFilters.sortMode === 'az'),
        selectedGroupID,
        expandedGroups
      ),
      groupFilters.term
    ),
    filters: groupFilters,
    onGroupFilterTermChange,
    onGroupFilterSortModeChange,
    onSelectGroup,
    onMoveEntryToGroup,
    selectedGroupID,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup,
    onMoveEntryToTrash,
    trashID,
    trashSelected,
    trashCount
  };
}

export function useActions() {
  const { onAddEntry } = useContext(VaultContext);

  return {
    onAddEntry
  };
}
