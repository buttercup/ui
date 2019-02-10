import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import { EntryFacade } from './props';

function title(entry) {
  const titleField = entry.fields.find(
    item => item.field === 'property' && item.property === 'title'
  );
  return titleField ? titleField.value : <i>(Untitled)</i>;
}

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;
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

export default class EntryDetails extends Component {
  static propTypes = {
    entry: EntryFacade
  };

  state = {
    editing: false
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
      <div>
        <h2>{title(this.props.entry)}</h2>
        <EntryPropertiesList>
          <With
            fields={
              this.state.editing
                ? this.props.entry.fields
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
                    <When condition={field.multiline}>
                      <ValueWithNewLines>{field.value}</ValueWithNewLines>
                    </When>
                    <Otherwise>{field.value}</Otherwise>
                  </Choose>
                </EntryPropertyValue>
              </EntryPropertyRow>
            </For>
          </With>
        </EntryPropertiesList>
      </div>
    );
  }
}
