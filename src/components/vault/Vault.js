import React, { Component } from 'react';
import { clone } from 'ramda';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import equals from 'fast-deep-equal';
import { createEntryFacade } from '@buttercup/facades';
import { VaultFacade } from './props';

export const VaultContext = React.createContext();

export class VaultProvider extends Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    vault: VaultFacade.isRequired
  };

  static defaultProps = {
    onUpdate: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      editingEntry: null,
      selectedEntryID: null,
      selectedGroupID: null,
      vault: this.props.vault
    };
  }

  get currentEntries() {
    return this.state.selectedGroupID
      ? this.state.vault.entries.filter(entry => entry.parentID === this.state.selectedGroupID)
      : [];
  }

  get selectedEntry() {
    return this.state.selectedEntryID
      ? this.state.vault.entries.find(entry => entry.id === this.state.selectedEntryID)
      : null;
  }

  componentDidMount() {
    this.handleSelectGroup(this.state.vault.groups[0].id);
  }

  componentDidUpdate() {
    if (!equals(this.state.vault, this.props.vault)) {
      this.setState({
        vault: this.props.vault
      });
    }
  }

  handleAddEntry = type => {
    const facade = createEntryFacade(null, { type });
    facade.parentID = this.state.selectedGroupID;
    this.setState({
      editingEntry: facade,
      selectedEntryID: null
    });
  };

  handleCancelEntryChanges = () => {
    this.setState({
      editingEntry: null
    });
  };

  handleSaveEntryChanges = () => {
    const newEntry = this.state.editingEntry;
    if (newEntry.id) {
      const targetIndex = this.state.vault.entries.findIndex(entry => entry.id === newEntry.id);
      if (targetIndex < 0) {
        throw new Error(
          `Failed saving entry changes: Unable to find entry with ID: ${newEntry.id}`
        );
      }
      this.state.vault.entries.splice(targetIndex, 1, newEntry);
    } else {
      newEntry.id = uuid();
      this.setState(
        ({ vault }) => ({
          selectedEntryID: newEntry.id,
          vault: {
            ...vault,
            entries: [...vault.entries, newEntry]
          }
        }),
        () => {
          this.props.onUpdate(this.state.vault);
        }
      );
    }
    this.setState({
      editingEntry: null
    });
  };

  handleSelectEntry = entryID => {
    if (this.state.editingEntry) {
      return;
    }
    this.setState({
      selectedEntryID: entryID
    });
  };

  handleSelectGroup = groupID => {
    const targetGroupID = groupID ? groupID : this.state.vault.groups[0].id;
    this.setState({
      selectedGroupID: targetGroupID,
      selectedEntryID: null
    });
  };

  handleEditEntry = () => {
    const currentEntry = this.selectedEntry;
    if (!currentEntry) {
      throw new Error('Cannot edit entry: No currently selected entry');
    }
    this.setState({
      editingEntry: clone(currentEntry)
    });
  };

  handleEntryFieldUpdate = (changedField, value) => {
    const { editingEntry } = this.state;
    this.setState({
      editingEntry: {
        ...editingEntry,
        fields: editingEntry.fields.map(field => {
          if (field.property === changedField.property) {
            return { ...field, value };
          }
          return field;
        })
      }
    });
  };

  render() {
    const context = {
      ...this.state,
      currentEntries: this.currentEntries,
      selectedEntry: this.selectedEntry,

      // Actions
      onSelectGroup: this.handleSelectGroup,
      onAddEntry: this.handleAddEntry,
      onSelectEntry: this.handleSelectEntry,
      onCancelEdit: this.handleCancelEntryChanges,
      onFieldUpdate: this.handleEntryFieldUpdate,
      onEdit: this.handleEditEntry,
      onSaveEdit: this.handleSaveEntryChanges
    };
    return <VaultContext.Provider value={context}>{this.props.children}</VaultContext.Provider>;
  }
}

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
        {({ editingEntry, selectedEntry, onCancelEdit, onEdit, onSaveEdit, onFieldUpdate }) => (
          <Component
            {...props}
            entry={editingEntry || selectedEntry}
            editing={!!editingEntry}
            onCancelEdit={onCancelEdit}
            onEdit={onEdit}
            onFieldUpdate={onFieldUpdate}
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
