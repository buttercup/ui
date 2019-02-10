import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { EntryFacade } from './props';

function title(entry) {
  const titleField = entry.fields.find(
    item => item.field === 'property' && item.property === 'title'
  );
  return titleField ? titleField.value : <i>(Untitled)</i>;
}

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;
const Entry = styled.div`
  padding: 6px 10px;
  user-select: none;
  cursor: pointer;
  background-color: ${props => (props.selected ? '#ccc' : '#fff')};
`;

export default class EntriesList extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(EntryFacade),
    onSelectEntry: PropTypes.func.isRequired
  };

  static defaultProps = {
    onSelectEntry: () => {}
  };

  state = {
    selectedEntryID: null
  };

  handleEntryClick(entryID) {
    this.setState({
      selectedEntryID: entryID
    });
    this.props.onSelectEntry(entryID);
  }

  render() {
    return (
      <EntriesContainer>
        <For each="entry" of={this.props.entries} index="entryIndex">
          <Entry
            key={entry.id}
            onClick={() => this.handleEntryClick(entry.id)}
            selected={
              this.state.selectedEntryID === entry.id ||
              (!this.state.selectedEntryID && entryIndex === 0)
            }
          >
            {title(entry)}
          </Entry>
        </For>
      </EntriesContainer>
    );
  }
}
