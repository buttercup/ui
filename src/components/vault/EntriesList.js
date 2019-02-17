import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { EntryFacade } from './props';
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

class EntriesList extends PureComponent {
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
      </EntriesContainer>
    );
  }
}

export default withEntries(EntriesList);
