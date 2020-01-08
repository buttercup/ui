import React, { useContext, useState } from 'react';
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
  MenuItem
} from '@blueprintjs/core';
import { GroupFacade } from './props';
import { useGroups } from './hooks/vault';
import { VaultContext } from './Vault';
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
  const { vault } = useContext(VaultContext);
  const [contextMenuOpen, setContextMenuVisibility] = useState(false);
  const {
    groups,
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

  const renderGroupsMenu = (items, parentNode) => (
    <>
      <If condition={parentNode}>
        <MenuItem
          text={`Move to ${parentNode.label}`}
          key={parentNode.id}
          icon={parentNode.icon}
          onClick={handleMove(parentNode.id)}
          disabled={entry.parentID === parentNode.id}
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
              {renderGroupsMenu(group.childNodes, group)}
            </MenuItem>
          </When>
          <Otherwise>
            <MenuItem
              text={group.label}
              key={group.id}
              icon={group.icon}
              onClick={handleMove(group.id)}
              disabled={entry.parentID === group.id}
            />
          </Otherwise>
        </Choose>
      </For>
    </>
  );

  const showContextMenu = (node, nodePath, evt) => {
    evt.preventDefault();
    const groupFacade = vault.groups.find(group => group.id === node.id);
    setContextMenuVisibility(true);
    ContextMenu.show(
      <Menu>
        {/* <MenuItem text="Move to..." icon="add-to-folder">
          {renderGroupsMenu(groups)}
        </MenuItem> */}
        <MenuItem text="Add New Group" icon="add" onClick={() => {}} />
        <MenuItem text={`Rename '${groupFacade.title}'`} icon="edit" onClick={() => {}} />
        <MenuItem text={`Move '${groupFacade.title}' to Trash`} icon="trash" onClick={() => {}} />
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
