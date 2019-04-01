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

const getNestedGroups = (groups = [], selectedGroupID, expandedGroups, parentID = '0') => {
  return groups
    .filter(group => group.parentID === parentID)
    .map(group => {
      const childNodes = getNestedGroups(groups, selectedGroupID, expandedGroups, group.id);
      const isExpanded = expandedGroups.includes(group.id);
      const isTrash = group.attributes && group.attributes.bc_group_role === 'trash';
      return {
        id: group.id,
        label: group.title,
        icon: isTrash ? 'trash' : isExpanded ? 'folder-open' : 'folder-close',
        hasCaret: childNodes.length,
        isSelected: group.id === selectedGroupID,
        isExpanded,
        childNodes
      };
    });
};

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
    groups: getNestedGroups(vault.groups, selectedGroupID, expandedGroups),
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
