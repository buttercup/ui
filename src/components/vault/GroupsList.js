import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tree } from '@blueprintjs/core';
import { GroupFacade } from './props';
import { withGroups } from './Vault';

const GroupsContainer = styled.div``;
const getNestedGroups = (groups = [], selectedGroupID, expandedGroups, parentID = '0') => {
  return groups
    .filter(group => group.parentID === parentID)
    .map(group => {
      const childNodes = getNestedGroups(groups, selectedGroupID, expandedGroups, group.id);
      const isExpanded = expandedGroups.includes(group.id);
      const isTrash = group.attributes && group.attributes.bc_group_role === 'trash';
      return {
        id: group.id,
        label: group.title,
        icon: isTrash ? 'trash' : isExpanded ? 'folder-open' : 'folder-close',
        hasCaret: childNodes.length,
        isSelected: group.id === selectedGroupID,
        isExpanded,
        childNodes
      };
    });
};

class GroupsList extends PureComponent {
  static propTypes = {
    groups: PropTypes.arrayOf(GroupFacade),
    selectedGroupID: PropTypes.string,
    onSelectGroup: PropTypes.func.isRequired
  };

  state = {
    expanded: []
  };

  static defaultProps = {
    onSelectGroup: () => {}
  };

  handleExpand = group => {
    this.setState({
      expanded: [...this.state.expanded, group.id]
    });
  };

  handleCollapse = group => {
    this.setState({
      expanded: this.state.expanded.filter(id => id !== group.id)
    });
  };

  render() {
    return (
      <GroupsContainer>
        <Tree
          contents={getNestedGroups(
            this.props.groups,
            this.props.selectedGroupID,
            this.state.expanded
          )}
          onNodeClick={group => this.props.onSelectGroup(group.id)}
          onNodeExpand={this.handleExpand}
          onNodeCollapse={this.handleCollapse}
        />
      </GroupsContainer>
    );
  }
}

export default withGroups(GroupsList);
