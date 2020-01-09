import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Tree as BaseTree,
  Button,
  Tag,
  Intent,
  Alignment,
  ContextMenu,
  Menu,
  MenuItem,
  MenuDivider
} from '@blueprintjs/core';
import { GroupFacade } from './props';
import { useGroups } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import { getThemeProp } from '../../utils';

const Tree = styled(BaseTree)`
  .node {
    &[class*='node-selected'] {
      > [class*='node-content'] {
        background-color: ${props =>
          getThemeProp(props, 'tree.selectedBackgroundColor')} !important;
        color: ${props => getThemeProp(props, 'tree.selectedTextColor')};
        > [icon] {
          color: ${props => getThemeProp(props, 'tree.selectedIconColor')} !important;
        }
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
  const [contextMenuOpen, setContextMenuVisibility] = useState(false);
  const {
    groups,
    groupsRaw,
    selectedGroupID,
    onSelectGroup,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup,
    handleModifyGroup,
    filters,
    onGroupFilterTermChange,
    onGroupFilterSortModeChange,
    trashCount,
    trashSelected,
    trashID
  } = useGroups();

  const handleMove = parentID => node => {
    // @todo move group
    // onMoveEntryToGroup(entry.id, parentID);
  };

  const renderGroupsMenu = (items, parentNode, selectedGroupID) => (
    <>
      <If condition={parentNode}>
        <MenuItem
          text={`Move to ${parentNode.label}`}
          key={parentNode.id}
          icon={parentNode.icon}
          onClick={handleMove(parentNode.id)}
          disabled={selectedGroupID === parentNode.id}
        />
        <MenuDivider />
      </If>
      <For each="group" of={items}>
        <Choose>
          <When condition={group.childNodes.length > 0}>
            <MenuItem
              text={group.label}
              key={group.id}
              icon={group.icon}
              onClick={handleMove(group.id)}
            >
              {renderGroupsMenu(group.childNodes, group, selectedGroupID)}
            </MenuItem>
          </When>
          <Otherwise>
            <MenuItem
              text={group.label}
              key={group.id}
              icon={group.icon}
              onClick={handleMove(group.id)}
              disabled={selectedGroupID === group.id}
            />
          </Otherwise>
        </Choose>
      </For>
    </>
  );

  const showContextMenu = (node, nodePath, evt) => {
    evt.preventDefault();
    const groupFacade = groupsRaw.find(group => group.id === node.id);
    setContextMenuVisibility(true);
    ContextMenu.show(
      <Menu>
        <MenuItem text={groupFacade.title} disabled />
        <MenuDivider />
        <MenuItem text="Add New Group" icon="add" onClick={() => {}} />
        <MenuItem text="Rename" icon="edit" onClick={() => {}} />
        <MenuDivider />
        <MenuItem text="Move to..." icon="add-to-folder">
          {renderGroupsMenu(groups, null, node.id)}
        </MenuItem>
        <MenuItem text="Move to Trash" icon="trash" onClick={() => {}} />
      </Menu>,
      { left: evt.clientX, top: evt.clientY },
      () => {
        setContextMenuVisibility(false);
      }
    );
  };

  return (
    <PaneContainer primary>
      <PaneHeader
        title="Groups"
        count={groups.length}
        filter={filters}
        onAddItem={() => {}}
        onTermChange={term => onGroupFilterTermChange(term)}
        onSortModeChange={sortMode => onGroupFilterSortModeChange(sortMode)}
      />
      <PaneContent>
        <Tree
          contents={groups}
          onNodeClick={group => onSelectGroup(group.id)}
          onNodeContextMenu={showContextMenu}
          onNodeExpand={handleExpandGroup}
          onNodeCollapse={handleCollapseGroup}
        />
      </PaneContent>
      <PaneFooter>
        <Button
          rightIcon={
            <Tag round minimal intent={trashCount > 0 ? Intent.WARNING : Intent.NONE}>
              {trashCount}
            </Tag>
          }
          icon="trash"
          fill
          minimal
          text="Trash"
          alignText={Alignment.LEFT}
          active={trashSelected}
          onClick={() => onSelectGroup(trashID)}
        />
      </PaneFooter>
    </PaneContainer>
  );
};

export default GroupsList;
