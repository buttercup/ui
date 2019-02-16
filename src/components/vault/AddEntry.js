import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaultType as defaultEntryType, types as entryTypes } from './entryTypes';
import { withGlobalActions } from './Vault';

const AddEntry = ({ onAddEntry }) => {
  const handleAddEntryClick = (event, type = defaultEntryType) => {
    event.preventDefault();
    onAddEntry(type);
  };

  return (
    <>
      <For each="entryType" of={entryTypes}>
        <button
          key={entryType.type}
          onClick={event => handleAddEntryClick(event, entryType.type)}
          title={entryType.description}
        >
          {entryType.title}
        </button>
      </For>
    </>
  );
};

AddEntry.propTypes = {
  onAddEntry: PropTypes.func.isRequired
};

AddEntry.defaultProps = {
  onAddEntry: () => {}
};

export default withGlobalActions(AddEntry);
