import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { EntryFacade } from './props';
import { withEntries } from './Vault';
import Entry from './Entry';

const EntriesContainer = styled.div``;
const Entries = styled.div`
  padding: 0.5rem;
`;

class EntriesList extends PureComponent {
  static propTypes = {
    entries: PropTypes.arrayOf(EntryFacade),
    selectedEntryID: PropTypes.string,
    className: PropTypes.string,
    onAddEntry: PropTypes.func.isRequired,
    onSelectEntry: PropTypes.func.isRequired
  };

  static defaultProps = {
    onAddEntry: () => {},
    onSelectEntry: () => {}
  };

  handleClick = (e, entry) => {
    this.props.onSelectEntry(entry.id);
  };

  render() {
    return (
      <EntriesContainer className={this.props.className}>
        <Entries>
          <For each="entry" of={this.props.entries} index="entryIndex">
            <Entry
              entry={entry}
              key={entry.id}
              onClick={e => this.handleClick(e, entry)}
              selected={this.props.selectedEntryID === entry.id}
            />
          </For>
        </Entries>
      </EntriesContainer>
    );
  }
}

export default withEntries(EntriesList);
