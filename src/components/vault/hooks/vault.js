import { useContext } from 'react';
import { VaultContext } from '../Vault';
import { filterNestedGroups, getNestedGroups } from '../utils/groups';
import { filterEntries } from '../utils/entries';

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
    onEntriesFilterTermChange
  } = useContext(VaultContext);
  return {
    entries: filterEntries(currentEntries, entriesFilters.term),
    onSelectEntry,
    selectedEntryID,
    filters: entriesFilters,
    onEntriesFilterTermChange
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
    onGroupFilterTermChange
  } = useContext(VaultContext);

  return {
    groups: filterNestedGroups(
      getNestedGroups(vault.groups, selectedGroupID, expandedGroups),
      groupFilters.term
    ),
    filters: groupFilters,
    onGroupFilterTermChange,
    onSelectGroup,
    onMoveEntryToGroup,
    selectedGroupID,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup
  };
}

export function useActions() {
  const { onAddEntry } = useContext(VaultContext);

  return {
    onAddEntry
  };
}
