import React, { useReducer, useState, useEffect, useRef } from 'react';
import { clone } from 'ramda';
import PropTypes from 'prop-types';
import { createEntryFacade } from '@buttercup/facades';
import { VaultFacade } from './props';
import { entryReducer } from './reducers/entry';
import { vaultReducer } from './reducers/vault';

export const VaultContext = React.createContext();

export const VaultProvider = ({ onUpdate, vault: vaultSource, children }) => {
  const [vault, dispatch] = useReducer(vaultReducer, clone(vaultSource));
  const [selectedGroupID, setSelectedGroupID] = useState(vault.groups[0].id);
  const [selectedEntryID, setSelectedEntryID] = useState(null);
  const [editingEntry, dispatchEditing] = useReducer(entryReducer, null);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const initRef = useRef(false);

  const selectedEntry = vault.entries.find(entry => entry.id === selectedEntryID);
  const currentEntries = vault.entries.filter(entry => entry.parentID === selectedGroupID);

  useEffect(() => {
    if (initRef.current === false) {
      console.log('Init call. Do not call onUpdate');
      initRef.current = true;
      return;
    }
    console.log('Debug: Running on Update function. Yay!');
    onUpdate(vault);
  }, [vault]);

  const context = {
    vault,
    currentEntries,
    selectedEntry,
    editingEntry,
    selectedEntryID,
    selectedGroupID,
    expandedGroups,

    // Actions
    onSelectGroup: groupID => {
      setSelectedGroupID(groupID);
      setSelectedEntryID(null);
    },
    handleExpandGroup: group => {
      setExpandedGroups([...expandedGroups, group.id]);
    },

    handleCollapseGroup: group => {
      setExpandedGroups(expandedGroups.filter(id => id !== group.id));
    },
    onAddEntry: type => {
      const facade = createEntryFacade(null, { type });
      facade.parentID = selectedGroupID;
      dispatchEditing({
        type: 'set-entry',
        payload: facade
      });
      setSelectedEntryID(null);
    },
    onEdit: () => {
      if (!selectedEntry) {
        return;
      }
      dispatchEditing({
        type: 'set-entry',
        payload: clone(selectedEntry)
      });
      setSelectedEntryID(null);
    },
    onSaveEdit: () => {
      if (!editingEntry) {
        return;
      }
      dispatch({
        type: 'save-entry',
        entry: editingEntry
      });
      dispatchEditing({
        type: 'stop-editing'
      });
      if (editingEntry.id) {
        setSelectedEntryID(editingEntry.id);
      }
    },
    onCancelEdit: () => {
      dispatchEditing({
        type: 'stop-editing'
      });
      if (editingEntry.id) {
        setSelectedEntryID(editingEntry.id);
      }
    },
    onSelectEntry: entryID => {
      if (editingEntry) {
        return;
      }
      setSelectedEntryID(entryID);
    },
    onAddField: () => {
      dispatchEditing({
        type: 'add-field'
      });
    },
    onFieldUpdate: (changedField, value) => {
      dispatchEditing({
        type: 'update-field',
        field: changedField,
        value
      });
    },
    onFieldNameUpdate: (changedField, property) => {
      dispatchEditing({
        type: 'update-field',
        field: changedField,
        property
      });
    },
    onRemoveField: field => {
      dispatchEditing({
        type: 'remove-field',
        field
      });
    }
  };
  return <VaultContext.Provider value={context}>{children}</VaultContext.Provider>;
};

VaultProvider.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  vault: VaultFacade.isRequired
};

VaultProvider.defaultProps = {
  onUpdate: () => {}
};
