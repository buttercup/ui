import { useContext } from 'react';
import { VaultContext } from '../Vault';

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
  const { currentEntries, onSelectEntry, selectedEntryID } = useContext(VaultContext);
  return {
    entries: currentEntries,
    onSelectEntry,
    selectedEntryID
  };
}

export function useGroups() {
  const {
    vault,
    onSelectGroup,
    selectedGroupID,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup
  } = useContext(VaultContext);

  return {
    groups: vault.groups,
    onSelectGroup,
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
