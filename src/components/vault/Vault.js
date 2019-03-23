import React, { useReducer, useState, useEffect } from 'react';
import { clone } from 'ramda';
import PropTypes from 'prop-types';
import equals from 'fast-deep-equal';
import { createEntryFacade, createFieldDescriptor } from '@buttercup/facades';
import { VaultFacade } from './props';
import { entryReducer } from './reducers/entry';
import { vaultReducer } from './reducers/vault';

export const VaultContext = React.createContext();

export const VaultProvider = ({ onUpdate, vault: vaultSource, children }) => {
  const [vault, dispatch] = useReducer(vaultReducer, clone(vaultSource));
  const [selectedGroupID, setSelectedGroupID] = useState(vault.groups[0].id);
  const [selectedEntryID, setSelectedEntryID] = useState(null);
  const [editingEntry, dispatchEditing] = useReducer(entryReducer, null);

  const selectedEntry = vault.entries.find(entry => entry.id === selectedEntryID);
  const currentEntries = vault.entries.filter(entry => entry.parentID === selectedGroupID);

  useEffect(() => {
    if (equals(vault, vaultSource)) {
      return;
    }
    onUpdate(vault);
  });

  const context = {
    vault,
    currentEntries,
    selectedEntry,
    editingEntry,
    selectedEntryID,
    selectedGroupID,

    // Actions
    onSelectGroup: groupID => {
      setSelectedGroupID(groupID);
      setSelectedEntryID(null);
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

export const withGroups = Component => {
  return function ConnectedGroupsComponent(props) {
    return (
      <VaultContext.Consumer>
        {({ vault, onSelectGroup, selectedGroupID }) => (
          <Component
            {...props}
            groups={vault.groups}
            selectedGroupID={selectedGroupID}
            onSelectGroup={onSelectGroup}
          />
        )}
      </VaultContext.Consumer>
    );
  };
};

export const withEntries = Component => {
  return function ConnectedEntriesComponent(props) {
    return (
      <VaultContext.Consumer>
        {({ currentEntries, onSelectEntry, selectedEntryID }) => (
          <Component
            {...props}
            entries={currentEntries}
            onSelectEntry={onSelectEntry}
            selectedEntryID={selectedEntryID}
          />
        )}
      </VaultContext.Consumer>
    );
  };
};

export const withEntry = Component => {
  return function ConnectedEntryComponent(props) {
    return (
      <VaultContext.Consumer>
        {({
          editingEntry,
          selectedEntry,
          onAddField,
          onCancelEdit,
          onEdit,
          onFieldNameUpdate,
          onFieldUpdate,
          onRemoveField,
          onSaveEdit
        }) => (
          <Component
            {...props}
            entry={editingEntry || selectedEntry}
            editing={!!editingEntry}
            onAddField={onAddField}
            onCancelEdit={onCancelEdit}
            onEdit={onEdit}
            onFieldNameUpdate={onFieldNameUpdate}
            onFieldUpdate={onFieldUpdate}
            onRemoveField={onRemoveField}
            onSaveEdit={onSaveEdit}
          />
        )}
      </VaultContext.Consumer>
    );
  };
};

export const withGlobalActions = Component => {
  return function ConnectedActionsComponent(props) {
    return (
      <VaultContext.Consumer>
        {({ onAddEntry }) => <Component {...props} onAddEntry={onAddEntry} />}
      </VaultContext.Consumer>
    );
  };
};
