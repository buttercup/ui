import React, { Component } from 'react';
import styled from 'styled-components';
import { VaultFacade } from './props';
import GroupsList from './GroupsList';
import EntriesList from './EntriesList';

const VaultContainer = styled.div`
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
    currentEntries: []
  };

  componentDidMount() {
    this.handleGroupChange(this.props.vault.groups[0].id);
  }

  handleGroupChange(groupID) {
    const targetGroupID = groupID ? groupID : this.props.vault.groups[0].id;
    this.setState({
      currentEntries: this.props.vault.entries.filter(entry => entry.parentID === targetGroupID)
    });
  }

  render() {
    return (
      <VaultContainer>
        <GroupsList groups={this.props.vault.groups} onSelectGroup={::this.handleGroupChange} />
        <EntriesList entries={this.state.currentEntries} onSelectEntry={() => {}} />
      </VaultContainer>
    );
  }
}
