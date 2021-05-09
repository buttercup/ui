import { useCallback, useContext, useMemo } from 'react';
import { VaultContext } from '../Vault';
import {
  countChildGroups,
  countChildGroupsAndEntries,
  filterNestedGroups,
  getAllEntriesInGroup,
  getAllGroupsInGroup,
  getNestedGroups,
  isTrashGroup,
  sortGroups
} from '../utils/groups';
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
    onFieldUpdateInPlace,
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
    onFieldUpdateInPlace,
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
    batchDeleteItems,
    onCreateGroup,
    onSelectGroup,
    onMoveEntryToGroup,
    onMoveGroup,
    onRenameGroup,
    selectedGroupID,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup,
    groupFilters,
    onGroupFilterTermChange,
    onGroupFilterSortModeChange
  } = useContext(VaultContext);

  const trashGroup = useMemo(() => vault.groups.find(isTrashGroup), [vault]);
  const trashID = useMemo(() => (trashGroup && trashGroup.id) || null, [trashGroup]);
  const trashSelected = selectedGroupID === trashID;
  const trashCount = useMemo(() => countChildGroupsAndEntries(vault, trashID), [vault, trashID]);
  const trashGroupCount = useMemo(() => countChildGroups(vault, trashID), [vault, trashID]);
  const onMoveEntryToTrash = entryID => onMoveEntryToGroup(entryID, trashID);
  const emptyTrash = useCallback(() => {
    if (!trashID) return;
    const trashEntries = getAllEntriesInGroup(vault, trashID);
    const trashGroups = getAllGroupsInGroup(vault, trashID);
    batchDeleteItems({
      groupIDs: trashGroups.map(group => group.id),
      entryIDs: trashEntries.map(entry => entry.id)
    });
  }, [vault, batchDeleteItems, trashID]);

  return {
    groups: filterNestedGroups(
      getNestedGroups(
        sortGroups(vault.groups, groupFilters.sortMode === 'az'),
        selectedGroupID,
        expandedGroups
      ),
      groupFilters.term
    ),
    groupsRaw: vault.groups,
    emptyTrash,
    filters: groupFilters,
    onCreateGroup,
    onGroupFilterTermChange,
    onGroupFilterSortModeChange,
    onMoveGroup,
    onMoveGroupToTrash: groupID => {
      if (!trashID) {
        console.error('No trash group found');
        return;
      }
      return onMoveGroup(groupID, trashID);
    },
    onRenameGroup,
    onSelectGroup,
    selectedGroupID,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup,
    onMoveEntryToGroup,
    onMoveEntryToTrash,
    trashGroups: trashGroup
      ? filterNestedGroups(
          getNestedGroups(
            sortGroups(vault.groups, groupFilters.sortMode === 'az'),
            selectedGroupID,
            expandedGroups,
            trashID,
            true // allow trash
          ),
          groupFilters.term
        )
      : [],
    trashID,
    trashSelected,
    trashCount,
    trashGroupCount
  };
}

export function useActions() {
  const { onAddEntry } = useContext(VaultContext);

  return {
    onAddEntry
  };
}
