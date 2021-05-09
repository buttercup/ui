import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import styled from 'styled-components';
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
  Tree as BaseTree
} from '@blueprintjs/core';
import { useGroups } from './hooks/vault';
import { useTranslations } from '../../hooks/i18n';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import { getThemeProp } from '../../utils';
import { VaultContext } from './Vault';

const KEYCODE_ENTER = 13;

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
  const [groupsContextOpen, setGroupsContextOpen] = useState(false);
  const [groupEditID, setGroupEditID] = useState(null);
  const [parentGroupID, setParentGroupID] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const groupTitleInputRef = useRef(null);
  const [trashOpen, setTrashOpen] = useState(false);
  const [emptyingTrash, setEmptyingTrash] = useState(false);
  const {
    groups,
    groupsRaw,
    emptyTrash,
    selectedGroupID,
    onCreateGroup,
    onMoveGroup,
    onMoveGroupToTrash,
    onRenameGroup,
    onSelectGroup,
    handleCollapseGroup,
    handleExpandGroup,
    filters,
    onGroupFilterTermChange,
    onGroupFilterSortModeChange,
    trashID,
    trashCount,
    trashSelected,
    trashGroups
  } = useGroups();
  const { readOnly } = useContext(VaultContext);
  const t = useTranslations();

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

  const handleTrashClick = useCallback(() => {
    const trashNowOpen = !trashOpen;
    setTrashOpen(trashNowOpen);
    onSelectGroup(trashNowOpen && trashID ? trashID : null);
  }, [trashOpen]);

  const handleTrashEmpty = useCallback(() => {
    setEmptyingTrash(false);
    emptyTrash();
  }, [emptyTrash]);

  const editGroup = (groupFacade, parentID = null) => {
    setGroupEditID(groupFacade ? groupFacade.id : -1);
    setNewGroupName(groupFacade ? groupFacade.title : '');
    setParentGroupID(parentID);
  };

  const moveGroupToGroup = (groupID, parentID) => {
    onMoveGroup(groupID, parentID);
  };

  const moveToTrash = groupID => {
    onMoveGroupToTrash(groupID);
    onSelectGroup(null);
  };

  const renderGroupsMenu = (items, parentNode, selectedGroupID) => (
    <>
      <If condition={!parentNode}>
        {/* Only show on first level */}
        <MenuItem
          text={t('group-menu.move-to-root')}
          key="moveRoot"
          icon="git-pull"
          onClick={() => moveGroupToGroup(selectedGroupID, '0')}
          disabled={
            readOnly || groupsRaw.find(groupRaw => groupRaw.id === selectedGroupID).parentID === '0'
          }
        />
        <MenuDivider />
      </If>
      <If condition={parentNode}>
        <MenuItem
          text={t('group-menu.move-to-parent', { group: parentNode.label })}
          key={parentNode.id}
          icon={parentNode.icon}
          onClick={() => moveGroupToGroup(selectedGroupID, parentNode.id)}
          disabled={readOnly || selectedGroupID === parentNode.id}
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
              disabled={readOnly || selectedGroupID === group.id}
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
              disabled={readOnly || selectedGroupID === group.id}
            />
          </Otherwise>
        </Choose>
      </For>
    </>
  );

  const showGroupContextMenu = (node, nodePath, evt) => {
    evt.preventDefault();
    const groupFacade = groupsRaw.find(group => group.id === node.id);
    setGroupsContextOpen(true);
    ContextMenu.show(
      <Menu>
        <MenuItem text={groupFacade.title} disabled />
        <MenuDivider />
        <MenuItem
          text={t('group-menu.add-new-group')}
          icon="add"
          onClick={() => editGroup(null, groupFacade.id)}
          disabled={readOnly}
        />
        <MenuItem
          text={t('group-menu.rename-group')}
          icon="edit"
          onClick={() => editGroup(groupFacade)}
          disabled={readOnly}
        />
        <MenuDivider />
        <MenuItem text={t('group-menu.move-to')} icon="add-to-folder" disabled={readOnly}>
          {renderGroupsMenu(groups, null, node.id)}
        </MenuItem>
        <MenuItem
          text={t('group-menu.move-to-trash')}
          icon="trash"
          onClick={() => moveToTrash(selectedGroupID)}
          disabled={readOnly}
        />
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
        <Choose>
          <When condition={!trashOpen}>
            <PaneHeader
              title={t('group.header')}
              count={groups.length}
              filter={filters}
              onAddItem={() => editGroup()}
              onTermChange={term => onGroupFilterTermChange(term)}
              onSortModeChange={sortMode => onGroupFilterSortModeChange(sortMode)}
              readOnly={readOnly}
            />
            <PaneContent>
              <Tree
                contents={groups}
                onNodeClick={group => onSelectGroup(group.id)}
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
                text={t('trash.header')}
                alignText={Alignment.LEFT}
                active={trashSelected}
                onClick={handleTrashClick}
              />
            </PaneFooter>
          </When>
          <Otherwise>
            <PaneHeader
              title={'Trash'}
              count={trashCount}
              filter={filters}
              onTermChange={term => onGroupFilterTermChange(term)}
              onSortModeChange={sortMode => onGroupFilterSortModeChange(sortMode)}
              readOnly={readOnly}
            />
            <PaneContent>
              <Tree
                contents={trashGroups}
                onNodeClick={group => onSelectGroup(group.id)}
                onNodeContextMenu={showGroupContextMenu}
                onNodeExpand={handleExpandGroup}
                onNodeCollapse={handleCollapseGroup}
              />
            </PaneContent>
            <PaneFooter>
              <Button minimal icon="undo" fill text="Close" onClick={() => setTrashOpen(false)} />
              <Button
                icon="delete"
                minimal
                title={'Empty Trash'}
                alignText={Alignment.LEFT}
                intent={Intent.DANGER}
                onClick={() => setEmptyingTrash(true)}
              />
            </PaneFooter>
          </Otherwise>
        </Choose>
      </PaneContainer>
      <Dialog
        icon="manually-entered-data"
        onClose={closeEditDialog}
        title={groupEditID === -1 ? t('group.prompt.create') : t('group.prompt.rename')}
        isOpen={groupEditID !== null}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>{t('group.prompt.message')}</p>
          <InputGroup
            leftIcon={groupEditID === -1 ? 'folder-new' : 'add-to-folder'}
            onChange={evt => setNewGroupName(evt.target.value)}
            value={newGroupName}
            inputRef={groupTitleInputRef}
            onKeyDown={evt => {
              if (evt.keyCode === KEYCODE_ENTER) {
                submitGroupChange();
              }
            }}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={closeEditDialog}>{t('group.prompt.cancel')}</Button>
            <Button intent={Intent.PRIMARY} onClick={submitGroupChange}>
              {t('group.prompt.save')}
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog icon="confirm" onClose={closeEditDialog} title={'Empty Trash'} isOpen={emptyingTrash}>
        <div className={Classes.DIALOG_BODY}>
          <p>Are you sure that you want to empty the trash?</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setEmptyingTrash(false)}>{t('group.prompt.cancel')}</Button>
            <Button intent={Intent.PRIMARY} onClick={handleTrashEmpty}>
              {t('group.prompt.save')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default GroupsList;
