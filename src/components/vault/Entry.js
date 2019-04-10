import React, { useState, useRef, useEffect } from 'react';
import path from 'path';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { Colors, Text, Classes, Menu, MenuItem, ContextMenu, MenuDivider } from '@blueprintjs/core';
import extractDomain from 'extract-domain';
import { EntryFacade } from './props';
import { getFacadeField, getThemeProp } from '../../utils';
import SiteIcon from './SiteIcon';
import { useGroups } from './hooks/vault';

function getEntryDomain(entry) {
  const url = getFacadeField(entry, 'url');
  return url ? extractDomain(url) : null;
}

function title(entry) {
  const titleField = getFacadeField(entry, 'title');
  return titleField || <i>(Untitled)</i>;
}

const EntryWrapper = styled.div`
  padding: 0.5rem;
  user-select: none;
  cursor: pointer;
  border-radius: 3px;
  color: inherit;
  background-color: transparent;
  display: flex;
  align-items: center;

  &:focus {
    background-color: ${props =>
      getThemeProp(props, 'list.focusedBackgroundColor', Colors.LIGHT_GRAY5)};
  }

  ${props =>
    props.focused &&
    css`
      background-color: ${props =>
        getThemeProp(props, 'list.focusedBackgroundColor', Colors.LIGHT_GRAY5)};
    `}

  ${props =>
    props.selected &&
    css`
      background-color: ${props =>
        getThemeProp(props, 'list.selectedBackgroundColor', Colors.COBALT3)} !important;
      color: ${props => getThemeProp(props, 'list.selectedTextColor', '#fff')};
    `}
`;

const ImageWrapper = styled.figure`
  padding: 0;
  margin: 0;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  border: 1px solid ${Colors.GRAY5};
  border-radius: 3px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.4);
  margin-right: 1rem;
  flex: 0 0 2.5rem;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const SecondaryText = styled(Text)`
  opacity: 0.7;
  margin-top: 0.1rem;
`;

const ContentWrapper = styled.div`
  flex: 1;
  /*
   * flex issue
   * https://css-tricks.com/flexbox-truncated-text/
  */
  min-width: 0;
`;

const Entry = ({ entry, selected, onClick, innerRef, ...props }) => {
  const [contextMenuOpen, setContextMenuVisibility] = useState(false);
  const { groups, onMoveEntryToGroup, onMoveEntryToTrash } = useGroups();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  });

  const handleMove = parentID => e => {
    onMoveEntryToGroup(entry.id, parentID);
  };

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

  const showContextMenu = e => {
    e.preventDefault();
    setContextMenuVisibility(true);
    ContextMenu.show(
      <Menu>
        <MenuItem text="Move to..." icon="add-to-folder">
          {renderGroupsMenu(groups)}
        </MenuItem>
        <MenuItem text="Move to Trash" icon="trash" onClick={() => onMoveEntryToTrash(entry.id)} />
      </Menu>,
      { left: e.clientX, top: e.clientY },
      () => {
        if (mounted.current) {
          setContextMenuVisibility(false);
        }
      }
    );
  };

  return (
    <EntryWrapper
      selected={selected}
      focused={contextMenuOpen}
      onClick={onClick}
      ref={innerRef}
      onContextMenu={showContextMenu}
      {...props}
    >
      <ImageWrapper>
        <SiteIcon domain={getEntryDomain(entry)} />
      </ImageWrapper>
      <ContentWrapper>
        <Text ellipsize>{title(entry)}</Text>
        <SecondaryText ellipsize className={Classes.TEXT_SMALL}>
          {getFacadeField(entry, 'username')}
        </SecondaryText>
      </ContentWrapper>
    </EntryWrapper>
  );
};

Entry.propTypes = {
  entry: EntryFacade,
  onClick: PropTypes.func.isRequired,
  innerRef: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Entry;
