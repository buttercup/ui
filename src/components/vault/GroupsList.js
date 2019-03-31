import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tree } from '@blueprintjs/core';
import { GroupFacade } from './props';
import { useGroups } from './hooks/vault';
import ListHeader from './ListHeader';

const GroupsContainer = styled.div`
  padding: 0.5rem 0;
`;

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

const GroupsList = () => {
  const {
    groups,
    selectedGroupID,
    onSelectGroup,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup
  } = useGroups();

  const contents = getNestedGroups(groups, selectedGroupID, expandedGroups);

  return (
    <GroupsContainer>
      <ListHeader title="Groups" count={contents.length} />
      <Tree
        contents={contents}
        onNodeClick={group => onSelectGroup(group.id)}
        onNodeExpand={handleExpandGroup}
        onNodeCollapse={handleCollapseGroup}
      />
    </GroupsContainer>
  );
};

export default GroupsList;
