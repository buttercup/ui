import React from 'react';
import PropTypes from 'prop-types';
import { defaultType as defaultEntryType, types as entryTypes } from './entryTypes';
import { useActions } from './hooks/vault';

const AddEntry = () => {
  const { onAddEntry } = useActions();
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

export default AddEntry;
