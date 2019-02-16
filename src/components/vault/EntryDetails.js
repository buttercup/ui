import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import { FormattedInput, FormattedText } from '@buttercup/react-formatted-input';
import { EntryFacade } from './props';
import { withEntry } from './Vault';

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

class EntryDetails extends PureComponent {
  static propTypes = {
    entry: EntryFacade,
    editing: PropTypes.bool.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSaveEdit: PropTypes.func.isRequired
  };

  static defaultProps = {
    editing: false,
    onCancelEdit: NOOP,
    onEdit: NOOP,
    onSaveEdit: NOOP
  };

  render() {
    return (
      <DetailsContainer>
        <Choose>
          <When condition={this.props.entry}>{this.renderEntryDetails()}</When>
          <Otherwise>
            <span>No entry selected</span>
          </Otherwise>
        </Choose>
      </DetailsContainer>
    );
  }

  renderEntryDetails() {
    return (
      <>
        <h2>{title(this.props.entry)}</h2>
        <EntryPropertiesList>
          <With
            fields={
              this.props.editing
                ? this.props.entry.fields.filter(item => item.field === 'property')
                : this.props.entry.fields.filter(
                    item => item.field === 'property' && item.property !== 'title'
                  )
            }
          >
            <For each="field" of={fields}>
              <EntryPropertyRow key={field.property}>
                <EntryProperty>{field.title}</EntryProperty>
                <EntryPropertyValue>
                  <Choose>
                    <When condition={this.props.editing}>
                      <Choose>
                        <When condition={field.multiline}>
                          <ValueWithNewLines>{field.value}</ValueWithNewLines>
                        </When>
                        <When condition={field.formatting && field.formatting.options}>
                          <select
                            defaultValue={field.value ? undefined : field.formatting.defaultOption}
                            value={field.value || undefined}
                            onChange={event => {
                              console.log('SET', event.target.value, field);
                              field.value = event.target.value;
                            }}
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
                            onChange={(formattedValue, raw) => {
                              field.value = raw;
                            }}
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
                            value={field.value}
                          />
                        </Otherwise>
                      </Choose>
                    </Otherwise>
                  </Choose>
                </EntryPropertyValue>
              </EntryPropertyRow>
            </For>
          </With>
          <If condition={!this.props.editing}>
            <button onClick={::this.props.onEdit}>Edit</button>
          </If>
          <If condition={this.props.editing}>
            <button onClick={::this.props.onSaveEdit}>Save</button>
            <button onClick={::this.props.onCancelEdit}>Cancel</button>
          </If>
        </EntryPropertiesList>
      </>
    );
  }
}

export default withEntry(EntryDetails);
