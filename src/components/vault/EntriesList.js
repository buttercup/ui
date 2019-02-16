import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { EntryFacade } from './props';
import { defaultType as defaultEntryType, types as entryTypes } from './entryTypes';
import { withEntries } from './Vault';

function title(entry) {
  const titleField = entry.fields.find(
    item => item.field === 'property' && item.property === 'title'
  );
  return titleField ? titleField.value : <i>(Untitled)</i>;
}

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  min-width: 25%;
`;
const Entries = styled.div`
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
const Controls = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

class EntriesList extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(EntryFacade),
    selectedEntryID: PropTypes.string,
    onAddEntry: PropTypes.func.isRequired,
    onSelectEntry: PropTypes.func.isRequired
  };

  static defaultProps = {
    onAddEntry: () => {},
    onSelectEntry: () => {}
  };

  handleAddEntryClick(event, type = defaultEntryType) {
    event.preventDefault();
    this.props.onAddEntry(type);
  }

  handleEntryClick(entryID) {
    this.setState({
      selectedEntryID: entryID
    });
    this.props.onSelectEntry(entryID);
  }

  render() {
    return (
      <EntriesContainer>
        <Entries>
          <For each="entry" of={this.props.entries} index="entryIndex">
            <Entry
              key={entry.id}
              onClick={() => this.handleEntryClick(entry.id)}
              selected={this.props.selectedEntryID === entry.id}
            >
              {title(entry)}
            </Entry>
          </For>
        </Entries>
        <Controls>
          <button onClick={::this.handleAddEntryClick}>Add Entry</button>
          <For each="entryType" of={entryTypes}>
            <button
              key={entryType.type}
              onClick={event => this.handleAddEntryClick(event, entryType.type)}
              title={entryType.description}
            >
              Add '{entryType.title}'
            </button>
          </For>
        </Controls>
      </EntriesContainer>
    );
  }
}

export default withEntries(EntriesList);
