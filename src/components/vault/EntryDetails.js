import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import { FormattedInput, FormattedText } from '@buttercup/react-formatted-input';
import { EntryFacade } from './props';
import { useCurrentEntry } from './hooks/vault';

function title(entry) {
  const titleField = entry.fields.find(
    item => item.field === 'property' && item.property === 'title'
  );
  return titleField ? titleField.value : <i>(Untitled)</i>;
}

const NOOP = () => {};

const DetailsContainer = styled.div``;
const EntryPropertiesList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;
const EntryPropertyRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 60px;
`;
const EntryProperty = styled.div`
  height: 100%;
  padding: 0px 8px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const EntryPropertyValue = styled.div`
  padding: 0px 8px;
  flex-grow: 10;
`;
const ValueWithNewLines = styled.span`
  white-space: pre-line;
`;

const EntryDetails = () => {
  const {
    entry,
    editing,
    onAddField,
    onCancelEdit,
    onEdit,
    onDeleteEntry,
    onFieldNameUpdate,
    onFieldUpdate,
    onRemoveField,
    onSaveEdit
  } = useCurrentEntry();

  const renderEntryDetails = () => {
    return (
      <>
        <If condition={!editing}>
          <h2>{title(entry)}</h2>
        </If>
        <EntryPropertiesList>
          <With
            fields={
              editing
                ? entry.fields.filter(item => item.field === 'property')
                : entry.fields.filter(
                    item => item.field === 'property' && item.property !== 'title'
                  )
            }
          >
            <For each="field" of={fields}>
              <EntryPropertyRow key={field.id}>
                <EntryProperty>
                  <Choose>
                    <When condition={editing && field.title.length <= 0}>
                      <input
                        type="text"
                        value={field.property}
                        onChange={event => {
                          onFieldNameUpdate(field, event.target.value);
                        }}
                      />
                    </When>
                    <Otherwise>{field.title || field.property}</Otherwise>
                  </Choose>
                </EntryProperty>
                <EntryPropertyValue>
                  <Choose>
                    <When condition={editing}>
                      <Choose>
                        <When condition={field.multiline}>
                          <TextArea
                            value={field.value}
                            onChange={event => onFieldUpdate(field, event.target.value)}
                          >
                            {field.value}
                          </TextArea>
                        </When>
                        <When condition={field.formatting && field.formatting.options}>
                          <select
                            defaultValue={field.value ? undefined : field.formatting.defaultOption}
                            value={field.value || undefined}
                            onChange={event => onFieldUpdate(field, event.target.value)}
                          >
                            <Choose>
                              <When condition={typeof field.formatting.options === 'object'}>
                                <For each="optionValue" of={Object.keys(field.formatting.options)}>
                                  <option key={optionValue} value={optionValue}>
                                    {field.formatting.options[optionValue]}
                                  </option>
                                </For>
                              </When>
                              <Otherwise>
                                <For each="optionValue" of={field.formatting.options}>
                                  <option key={optionValue} value={optionValue}>
                                    {optionValue}
                                  </option>
                                </For>
                              </Otherwise>
                            </Choose>
                          </select>
                        </When>
                        <Otherwise>
                          <FormattedInput
                            value={field.value}
                            onChange={(formattedValue, raw) => onFieldUpdate(field, raw)}
                            placeholder={
                              field.formatting && field.formatting.placeholder
                                ? field.formatting.placeholder
                                : field.title
                            }
                            format={
                              field.formatting && field.formatting.format
                                ? field.formatting.format
                                : undefined
                            }
                          />
                        </Otherwise>
                      </Choose>
                    </When>
                    <Otherwise>
                      <Choose>
                        <When condition={field.multiline}>
                          <ValueWithNewLines>{field.value}</ValueWithNewLines>
                        </When>
                        <When condition={field.formatting && field.formatting.options}>
                          {typeof field.formatting.options === 'object'
                            ? field.formatting.options[field.value] || field.value
                            : field.value}
                        </When>
                        <Otherwise>
                          <FormattedText
                            format={
                              field.formatting && field.formatting.format
                                ? field.formatting.format
                                : undefined
                            }
                            value={field.value || ''}
                          />
                        </Otherwise>
                      </Choose>
                    </Otherwise>
                  </Choose>
                </EntryPropertyValue>
                <If condition={editing && field.removeable}>
                  <button onClick={() => onRemoveField(field)}>X</button>
                </If>
              </EntryPropertyRow>
            </For>
          </With>
          <If condition={!editing}>
            <button onClick={onEdit}>Edit</button>
          </If>
          <If condition={editing}>
            <button onClick={onAddField}>Add Field</button>
            <button onClick={onSaveEdit}>Save</button>
            <button onClick={onCancelEdit}>Cancel</button>
            <button onClick={() => onDeleteEntry(entry.id)}>Delete Entry</button>
          </If>
        </EntryPropertiesList>
      </>
    );
  };

  return (
    <DetailsContainer>
      <Choose>
        <When condition={entry}>{renderEntryDetails()}</When>
        <Otherwise>
          <span>No entry selected</span>
        </Otherwise>
      </Choose>
    </DetailsContainer>
  );
};

export default EntryDetails;
