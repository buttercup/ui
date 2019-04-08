import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tree as BaseTree } from '@blueprintjs/core';
import { GroupFacade } from './props';
import { useGroups } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent } from './Pane';
import { getThemeProp } from '../../utils';

const Tree = styled(BaseTree)`
  .node {
    &[class*='node-selected'] {
      > [class*='node-content'] {
        background-color: ${props =>
          getThemeProp(props, 'tree.selectedBackgroundColor')} !important;
        color: ${props => getThemeProp(props, 'tree.selectedTextColor')};
      }
      [icon] {
        color: ${props => getThemeProp(props, 'tree.selectedIconColor')} !important;
      }
    }
    > [class*='node-content'] {
      border-radius: 3px;
      cursor: pointer;

      &:hover {
        background-color: ${props => getThemeProp(props, 'tree.hoverBackgroundColor')};
      }
    }
  }
`;

const GroupsList = () => {
  const {
    groups,
    selectedGroupID,
    onSelectGroup,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup,
    filters,
    onGroupFilterTermChange
  } = useGroups();

  return (
    <PaneContainer primary>
      <PaneHeader
        title="Groups"
        count={groups.length}
        filter={filters}
        onTermChange={term => onGroupFilterTermChange(term)}
      />
      <PaneContent>
        <Tree
          contents={groups}
          onNodeClick={group => onSelectGroup(group.id)}
          onNodeExpand={handleExpandGroup}
          onNodeCollapse={handleCollapseGroup}
        />
      </PaneContent>
    </PaneContainer>
  );
};

export default GroupsList;
