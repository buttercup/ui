import React, { Component } from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import equals from 'fast-deep-equal';
import { createEntryFacade } from '@buttercup/facades';
import { VaultFacade } from './props';
import GroupsList from './GroupsList';
import EntriesList from './EntriesList';
import EntryDetailsView from './EntryDetails';

const EntryDetails = styled(EntryDetailsView)`
  flex-grow: 2;
`;
const VaultContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

export default class Vault extends Component {
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

  addEntry(type) {
    const facade = createEntryFacade();
    facade.parentID = this.state.selectedGroupID;
    this.setState({
      editingEntry: facade
    });
  }

  cancelEntryChanges() {
    this.setState({
      editingEntry: null
    });
  }

  componentDidMount() {
    this.selectGroup(this.state.vault.groups[0].id);
  }

  componentDidUpdate() {
    if (!equals(this.state.vault, this.props.vault)) {
      this.setState({
        vault: this.props.vault
      });
    }
  }

  getSelectedEntry() {
    return this.state.selectedEntryID
      ? this.state.vault.entries.find(entry => entry.id === this.state.selectedEntryID)
      : null;
  }

  render() {
    return (
      <VaultContainer>
        <GroupsList groups={this.state.vault.groups} onSelectGroup={::this.selectGroup} />
        <EntriesList
          entries={this.currentEntries}
          onAddEntry={::this.addEntry}
          onSelectEntry={::this.selectEntry}
        />
        <EntryDetails
          entry={this.state.editingEntry || this.getSelectedEntry()}
          editing={!!this.state.editingEntry}
          onCancelEdit={::this.cancelEntryChanges}
          onEdit={::this.startEditingEntry}
          onSaveEdit={::this.saveEntryChanges}
        />
      </VaultContainer>
    );
  }

  saveEntryChanges() {
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
  }

  selectEntry(entryID) {
    this.setState({
      selectedEntryID: entryID
    });
  }

  selectGroup(groupID) {
    const targetGroupID = groupID ? groupID : this.state.vault.groups[0].id;
    this.setState({
      selectedGroupID: targetGroupID
    });
  }

  startEditingEntry() {
    const currentEntry = this.getSelectedEntry();
    if (!currentEntry) {
      throw new Error('Cannot edit entry: No currently selected entry');
    }
    const clonedEntry = JSON.parse(JSON.stringify(currentEntry));
    this.setState({
      editingEntry: clonedEntry
    });
  }
}
