import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tree } from '@blueprintjs/core';
import { GroupFacade } from './props';
import { useGroups } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent } from './Pane';

const GroupsList = () => {
  const {
    groups,
    selectedGroupID,
    onSelectGroup,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup
  } = useGroups();

  return (
    <PaneContainer>
      <PaneHeader title="Groups" count={groups.length} />
      <PaneContent bleed>
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
