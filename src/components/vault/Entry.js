import React, { useContext, useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { Colors, Text, Classes, Menu, MenuItem, ContextMenu, MenuDivider } from "@blueprintjs/core";
import {
    DEFAULT_ENTRY_TYPE,
    EntryType,
    EntryURLType,
    fieldsToProperties,
    getEntryURLs
} from "buttercup/web";
import { EntryFacade } from "./props";
import { getFacadeField, getThemeProp } from "../../utils";
import SiteIcon from "./SiteIcon";
import { useGroups } from "./hooks/vault";
import { VaultContext } from "./Vault";
import { extractDomain } from "./utils/domain";
import { colors } from "../../variables";
import { useTranslations } from "../../hooks/i18n";

function getEntryDomain(entry) {
    const properties = fieldsToProperties(entry.fields);
    const [url] = [
        ...getEntryURLs(properties, EntryURLType.Icon),
        ...getEntryURLs(properties, EntryURLType.Any)
    ];
    return url ? extractDomain(url) : null;
}

function title(entry) {
    return getFacadeField(entry, "title", entry.matches) || <i>(Untitled)</i>;
}

function username(entry) {
    if (entry.type === EntryType.Note) {
        const note = getFacadeField(entry, "note");
        return (note && note.slice(0, 60)) || <i>Empty</i>;
    } else if (entry.type === EntryType.SSHKey) {
        const key = getFacadeField(entry, "publicKey");
        return (key && key.slice(0, 60)) || <i>Empty</i>;
    }
    return getFacadeField(entry, "username", entry.matches) || <i>No username</i>;
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
        background-color: ${props => getThemeProp(props, "list.focusedBackgroundColor")};
        outline-color: ${colors.BRAND_PRIMARY};
        outline-style: solid;
    }

    ${props =>
        props.focused &&
        css`
            background-color: ${props => getThemeProp(props, "list.focusedBackgroundColor")};
        `}

    ${props =>
        props.selected &&
        css`
            background-color: ${props =>
                getThemeProp(props, "list.selectedBackgroundColor")} !important;
            color: ${props => getThemeProp(props, "list.selectedTextColor")};
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
    const t = useTranslations();
    const [contextMenuOpen, setContextMenuVisibility] = useState(false);
    const { groups, onMoveEntryToGroup, onMoveEntryToTrash, trashID } = useGroups();
    const { iconsEnabled, iconsPath, readOnly } = useContext(VaultContext);
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
                    text={t(`entry-menu.move-to-parent`, { group: parentNode.label })}
                    key={parentNode.id}
                    icon={parentNode.icon}
                    onClick={handleMove(parentNode.id)}
                    disabled={entry.parentID === parentNode.id || readOnly}
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
                            disabled={readOnly}
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
                            disabled={entry.parentID === group.id || readOnly}
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
                <MenuItem text={t("entry-menu.move-to")} icon="add-to-folder">
                    {renderGroupsMenu(groups)}
                </MenuItem>
                <If condition={entry.parentID !== trashID}>
                    <MenuItem
                        text={t("entry-menu.move-to-trash")}
                        icon="trash"
                        onClick={() => onMoveEntryToTrash(entry.id)}
                        disabled={readOnly}
                    />
                </If>
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
                <SiteIcon
                    domain={iconsEnabled ? getEntryDomain(entry) : null}
                    iconPath={iconsPath}
                    type={entry.type || DEFAULT_ENTRY_TYPE}
                />
            </ImageWrapper>
            <ContentWrapper>
                <Text ellipsize>{title(entry)}</Text>
                <SecondaryText ellipsize className={Classes.TEXT_SMALL}>
                    {username(entry)}
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
