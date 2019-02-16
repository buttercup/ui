import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GroupFacade } from './props';
import { withGroups } from './Vault';

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

class GroupsList extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(GroupFacade),
    selectedGroupID: PropTypes.string,
    onSelectGroup: PropTypes.func.isRequired
  };

  static defaultProps = {
    onSelectGroup: () => {}
  };

  render() {
    return (
      <GroupsContainer>
        <For each="group" of={this.props.groups} index="groupIndex">
          <Group
            key={group.id}
            onClick={() => this.props.onSelectGroup(group.id)}
            selected={this.props.selectedGroupID === group.id}
          >
            {group.title}
          </Group>
        </For>
      </GroupsContainer>
    );
  }
}

export default withGroups(GroupsList);
