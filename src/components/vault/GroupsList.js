import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GroupFacade } from './props';

const GroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  min-width: 25%;
`;
const Group = styled.div`
  padding: 6px 10px;
  user-select: none;
  cursor: pointer;
  background-color: ${props => (props.selected ? '#ccc' : '#fff')};
`;

export default class GroupsList extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(GroupFacade),
    onSelectGroup: PropTypes.func.isRequired
  };

  static defaultProps = {
    onSelectGroup: () => {}
  };

  state = {
    selectedGroupID: null
  };

  handleGroupClick(groupID) {
    this.setState({
      selectedGroupID: groupID
    });
    this.props.onSelectGroup(groupID);
  }

  render() {
    return (
      <GroupsContainer>
        <For each="group" of={this.props.groups} index="groupIndex">
          <Group
            key={group.id}
            onClick={() => this.handleGroupClick(group.id)}
            selected={
              this.state.selectedGroupID === group.id ||
              (!this.state.selectedGroupID && groupIndex === 0)
            }
          >
            {group.title}
          </Group>
        </For>
      </GroupsContainer>
    );
  }
}
