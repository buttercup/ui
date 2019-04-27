import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import {
  NonIdealState,
  Button,
  Intent,
  Card,
  InputGroup,
  HTMLSelect,
  // TextArea,
  EditableText,
  Classes,
  ControlGroup,
  Colors,
  FormGroup,
  ButtonGroup
} from '@blueprintjs/core';
import { FormattedInput, FormattedText } from '@buttercup/react-formatted-input';
import { EntryFacade } from './props';
import { useCurrentEntry, useGroups } from './hooks/vault';
import { PaneContainer, PaneContent, PaneHeader, PaneFooter } from './Pane';
import ConfirmButton from './ConfirmButton';
import { copyToClipboard } from '../../utils';

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;

  > div button {
    margin-right: 10px;
  }
`;

function title(entry) {
  const titleField = entry.fields.find(
    item => item.field === 'property' && item.property === 'title'
  );
  return titleField ? titleField.value : <i>(Untitled)</i>;
}

const NOOP = () => {};

const EntryPropertyRow = styled.div`
  /* display: grid;
  grid-template-columns: 100px 1fr; */
  padding: 0.5rem 0;
`;
const EntryProperty = styled.div`
  display: flex;
  align-items: center;
`;
const EntryPropertyValue = styled.div`
  display: flex;
  align-items: center;
`;
const ValueWithNewLines = styled.span`
  white-space: pre-line;
`;
const FormContainer = styled.div`
  background-color: ${p => (p.primary ? Colors.LIGHT_GRAY5 : 'transparent')};
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
`;
const CustomFieldsHeading = styled.h5`
  text-transform: uppercase;
  color: ${Colors.GRAY3};
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  margin-bottom: 0;

  &:before,
  &:after {
    display: flex;
    content: '';
    height: 1px;
    background-color: ${Colors.LIGHT_GRAY2};
    width: 100%;
  }

  span {
    padding: 0 0.5rem;
  }
`;
const FieldRowContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-gap: 1rem;
  margin-bottom: 0.5rem;
`;
const FieldRowLabel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${Colors.GRAY3};
`;
const FieldRowChildren = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const FieldTextToolbar = styled(ButtonGroup)`
  margin-left: 0.5rem;
  opacity: 0;
`;
const FieldTextWrapper = styled.span`
  border: 1px dashed transparent;
  border-radius: 2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px;

  &:hover {
    border-color: ${Colors.LIGHT_GRAY1};

    ${FieldTextToolbar} {
      opacity: 1;
    }
  }
`;

const FieldText = ({ field }) => {
  const [visible, toggleVisibility] = useState(false);
  const Element = field.secret ? 'code' : 'span';

  return (
    <FieldTextWrapper role="content">
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
          <Element>
            <Choose>
              <When condition={field.secret && !visible}>●●●●</When>
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
          </Element>
        </Otherwise>
      </Choose>
      <FieldTextToolbar>
        <If condition={field.secret}>
          <Button
            text={visible ? 'Hide' : 'Reveal'}
            small
            onClick={() => toggleVisibility(!visible)}
          />
        </If>
        <Button icon="clipboard" small onClick={() => copyToClipboard(field.value)} />
      </FieldTextToolbar>
    </FieldTextWrapper>
  );
};

const FieldRowGroup = ({ label, children }) => {
  return (
    <FieldRowContainer>
      <FieldRowLabel>{label}</FieldRowLabel>
      <FieldRowChildren>{children}</FieldRowChildren>
    </FieldRowContainer>
  );
};

const FieldRow = ({ field, editing, onFieldNameUpdate, onFieldUpdate, onRemoveField }) => {
  const label =
    editing && field.removeable ? (
      <EditableText
        value={field.property}
        onChange={value => {
          onFieldNameUpdate(field, value);
        }}
      />
    ) : (
      field.title || field.property
    );
  return (
    <EntryPropertyRow key={field.id}>
      <FieldRowGroup label={label}>
        <Choose>
          <When condition={editing}>
            <Choose>
              <When condition={field.multiline}>
                <TextArea
                  className={Classes.INPUT}
                  value={field.value}
                  onChange={val => onFieldUpdate(field, val.target.value)}
                />
              </When>
              <When condition={field.formatting && field.formatting.options}>
                <HTMLSelect
                  fill
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
                </HTMLSelect>
              </When>
              <Otherwise>
                <FormattedInput
                  minimal
                  className={Classes.FILL}
                  element={InputGroup}
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
            <FieldText field={field} />
          </Otherwise>
        </Choose>
      </FieldRowGroup>
    </EntryPropertyRow>
  );
};

const EntryDetailsContent = () => {
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
  const { onMoveEntryToTrash, trashID } = useGroups();

  const editableFields = editing
    ? entry.fields.filter(item => item.field === 'property')
    : entry.fields.filter(item => item.field === 'property' && item.property !== 'title');
  const mainFields = editableFields.filter(field => !field.removeable);
  const removeableFields = editableFields.filter(field => field.removeable);

  return (
    <>
      <PaneHeader title={editing ? 'Edit Document' : title(entry)} />
      <PaneContent>
        <FormContainer primary>
          <For each="field" of={mainFields}>
            <FieldRow
              field={field}
              onFieldNameUpdate={onFieldNameUpdate}
              onFieldUpdate={onFieldUpdate}
              onRemoveField={onRemoveField}
              editing={editing}
            />
          </For>
        </FormContainer>
        <CustomFieldsHeading>
          <span>Custom Fields:</span>
        </CustomFieldsHeading>
        <If condition={removeableFields.length > 0}>
          <FormContainer>
            <For each="field" of={removeableFields}>
              <FieldRow
                field={field}
                onFieldNameUpdate={onFieldNameUpdate}
                onFieldUpdate={onFieldUpdate}
                onRemoveField={onRemoveField}
                editing={editing}
              />
            </For>
          </FormContainer>
        </If>
        <If condition={editing}>
          <button onClick={onAddField}>Add Field</button>
        </If>
      </PaneContent>
      <PaneFooter>
        <ActionBar>
          <If condition={!editing}>
            <Button onClick={onEdit} icon="edit" disabled={entry.parentID === trashID}>
              Edit
            </Button>
          </If>
          <If condition={editing}>
            <div>
              <Button onClick={onSaveEdit} intent={Intent.PRIMARY} icon="tick">
                Save
              </Button>
              <Button onClick={onCancelEdit}>Cancel</Button>
            </div>
            <ConfirmButton
              icon="trash"
              title="Confirm move to Trash"
              description="Are you sure you want to move this entry to Trash?"
              primaryAction="Move to Trash"
              onClick={() => onMoveEntryToTrash(entry.id)}
              danger
            />
          </If>
        </ActionBar>
      </PaneFooter>
    </>
  );
};

const EntryDetails = () => {
  const { entry } = useCurrentEntry();
  return (
    <PaneContainer>
      <Choose>
        <When condition={entry}>
          <EntryDetailsContent />
        </When>
        <Otherwise>
          <PaneContent>
            <NonIdealState
              icon="satellite"
              title="No document selected"
              description="Select or create a new document."
            />
          </PaneContent>
        </Otherwise>
      </Choose>
    </PaneContainer>
  );
};

export default EntryDetails;
