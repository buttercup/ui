import React, { Component } from 'react';
import styled from 'styled-components';
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
    vault: VaultFacade.isRequired
  };

  state = {
    currentEntries: [],
    selectedEntryID: null,
    selectedGroupID: null
  };

  componentDidMount() {
    this.handleGroupChange(this.props.vault.groups[0].id);
  }

  getSelectedEntry() {
    return this.state.selectedEntryID
      ? this.props.vault.entries.find(entry => entry.id === this.state.selectedEntryID)
      : null;
  }

  handleAddEntry(type) {
    const facade = createEntryFacade();
    facade.parentID = this.state.selectedGroupID;
  }

  handleEntryChange(entryID) {
    this.setState({
      selectedEntryID: entryID
    });
  }

  handleGroupChange(groupID) {
    const targetGroupID = groupID ? groupID : this.props.vault.groups[0].id;
    this.setState({
      currentEntries: this.props.vault.entries.filter(entry => entry.parentID === targetGroupID),
      selectedGroupID: targetGroupID
    });
  }

  render() {
    return (
      <VaultContainer>
        <GroupsList groups={this.props.vault.groups} onSelectGroup={::this.handleGroupChange} />
        <EntriesList
          entries={this.state.currentEntries}
          onAddEntry={::this.handleAddEntry}
          onSelectEntry={::this.handleEntryChange}
        />
        <EntryDetails entry={this.getSelectedEntry()} />
      </VaultContainer>
    );
  }
}
