import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Alignment,
  Button,
  Classes,
  ContextMenu,
  Dialog,
  InputGroup,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Tag,
  Tree as BaseTree,
} from '@blueprintjs/core';
import { GroupFacade } from './props';
import { useGroups } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import { getThemeProp } from '../../utils';

const KEYCODE_ENTER = 13;

const Tree = styled(BaseTree)`
  .node {
    &[class*='node-selected'] {
      > [class*='node-content'] {
        background-color: ${(props) =>
          getThemeProp(props, 'tree.selectedBackgroundColor')} !important;
        color: ${(props) => getThemeProp(props, 'tree.selectedTextColor')};
        > [icon] {
          color: ${(props) => getThemeProp(props, 'tree.selectedIconColor')} !important;
        }
      }
    }
    > [class*='node-content'] {
      border-radius: 3px;
      cursor: pointer;

      &:hover {
        background-color: ${(props) => getThemeProp(props, 'tree.hoverBackgroundColor')};
      }
    }
  }
`;

const GroupsList = () => {
  const [groupsContextOpen, setGroupsContextOpen] = useState(false);
  const [groupEditID, setGroupEditID] = useState(null);
  const [parentGroupID, setParentGroupID] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const groupTitleInputRef = useRef(null);
  const {
    groups,
    groupsRaw,
    selectedGroupID,
    onCreateGroup,
    onMoveGroup,
    onMoveGroupToTrash,
    onRenameGroup,
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
    trashID,
  } = useGroups();

  useEffect(() => {
    if (groupTitleInputRef && groupTitleInputRef.current) {
      groupTitleInputRef.current.focus();
    }
  }, [groupTitleInputRef.current]);

  const closeEditDialog = () => {
    setGroupEditID(null);
    setNewGroupName('');
    setParentGroupID(null);
  };

  const confirmEmptyTrash = () => {
    // @todo empty trash
  };

  const editGroup = (groupFacade, parentID = null) => {
    setGroupEditID(groupFacade ? groupFacade.id : -1);
    setNewGroupName(groupFacade ? groupFacade.title : '');
    setParentGroupID(parentID);
  };

  const moveGroupToGroup = (groupID, parentID) => {
    onMoveGroup(groupID, parentID);
  };

  const moveToTrash = (groupID) => {
    onMoveGroupToTrash(groupID);
  };

  const renderGroupsMenu = (items, parentNode, selectedGroupID) => (
    <>
      <If condition={!parentNode}>
        {/* Only show on first level */}
        <MenuItem
          text="Move to root level"
          key="moveRoot"
          icon="git-pull"
          onClick={() => moveGroupToGroup(selectedGroupID, '0')}
          disabled={groupsRaw.find((groupRaw) => groupRaw.id === selectedGroupID).parentID === '0'}
        />
        <MenuDivider />
      </If>
      <If condition={parentNode}>
        <MenuItem
          text={`Move to ${parentNode.label}`}
          key={parentNode.id}
          icon={parentNode.icon}
          onClick={() => moveGroupToGroup(selectedGroupID, parentNode.id)}
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
              onClick={() => moveGroupToGroup(selectedGroupID, group.id)}
              disabled={selectedGroupID === group.id}
            >
              {renderGroupsMenu(group.childNodes, group, selectedGroupID)}
            </MenuItem>
          </When>
          <Otherwise>
            <MenuItem
              text={group.label}
              key={group.id}
              icon={group.icon}
              onClick={() => moveGroupToGroup(selectedGroupID, group.id)}
              disabled={selectedGroupID === group.id}
            />
          </Otherwise>
        </Choose>
      </For>
    </>
  );

  const showGroupContextMenu = (node, nodePath, evt) => {
    evt.preventDefault();
    const groupFacade = groupsRaw.find((group) => group.id === node.id);
    setGroupsContextOpen(true);
    ContextMenu.show(
      <Menu>
        <MenuItem text={groupFacade.title} disabled />
        <MenuDivider />
        <MenuItem text="Add New Group" icon="add" onClick={() => editGroup(null, groupFacade.id)} />
        <MenuItem text="Rename" icon="edit" onClick={() => editGroup(groupFacade)} />
        <MenuDivider />
        <MenuItem text="Move to..." icon="add-to-folder">
          {renderGroupsMenu(groups, null, node.id)}
        </MenuItem>
        <MenuItem text="Move to Trash" icon="trash" onClick={() => moveToTrash(selectedGroupID)} />
      </Menu>,
      { left: evt.clientX, top: evt.clientY },
      () => {
        setGroupsContextOpen(false);
      }
    );
  };

  const submitGroupChange = () => {
    if (groupEditID !== null && groupEditID !== -1) {
      onRenameGroup(groupEditID, newGroupName);
    } else {
      onCreateGroup(parentGroupID, newGroupName);
    }
    closeEditDialog();
  };

  return (
    <>
      <PaneContainer primary>
        <PaneHeader
          title="Groups"
          count={groups.length}
          filter={filters}
          onAddItem={() => editGroup()}
          onTermChange={(term) => onGroupFilterTermChange(term)}
          onSortModeChange={(sortMode) => onGroupFilterSortModeChange(sortMode)}
        />
        <PaneContent>
          <Tree
            contents={groups}
            onNodeClick={(group) => onSelectGroup(group.id)}
            onNodeContextMenu={showGroupContextMenu}
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
      <Dialog
        icon="manually-entered-data"
        onClose={closeEditDialog}
        title={groupEditID === -1 ? 'Create Group' : 'Rename Group'}
        isOpen={groupEditID !== null}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>Enter group title:</p>
          <InputGroup
            leftIcon={groupEditID === -1 ? 'folder-new' : 'add-to-folder'}
            onChange={(evt) => setNewGroupName(evt.target.value)}
            value={newGroupName}
            inputRef={groupTitleInputRef}
            onKeyDown={(evt) => {
              if (evt.keyCode === KEYCODE_ENTER) {
                submitGroupChange();
              }
            }}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button intent={Intent.PRIMARY} onClick={submitGroupChange}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default GroupsList;
