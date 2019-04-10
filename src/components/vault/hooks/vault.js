import { useContext } from 'react';
import { VaultContext } from '../Vault';
import { filterNestedGroups, getNestedGroups, isTrashGroup } from '../utils/groups';
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

  const trashGroup = vault.groups.find(isTrashGroup);
  const trashID = trashGroup && trashGroup.id;
  const trashSelected = selectedGroupID === trashID;
  const trashCount = vault.entries.filter(entry => entry.parentID === trashID).length;
  const onMoveEntryToTrash = entryID => onMoveEntryToGroup(entryID, trashID);

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
