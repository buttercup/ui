import React, { useCallback, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Icon } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";
import styled, { useTheme } from "styled-components";
import { getThemeProp } from "../../../utils";

export const TAB_HEIGHT_NORMAL = 42;
export const TAB_HEIGHT_SELECTED = 45;

const Close = styled(Icon)`
    margin-left: 8px;
    padding: 3px;
    border-radius: 50%;

    &:hover {
        background-color: ${p => getThemeProp(p, "tab.closeBackgroundHover")};
    }
`;

const DropTarget = styled.div`
    height: ${TAB_HEIGHT_NORMAL}px;
    position: absolute;
    width: ${p => p.isOver ? "calc(50% + 104px)" : "calc(50% + 4px)"};
    ${p => p.side}: ${p => p.isOver ? "-104px" : "-4px"};
    top: 0px;
    transition: all 0.3s;
`;

const TabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-right: ${p => p.isOverRight ? "104px" : "4px"};
    margin-bottom: -1px;
    margin-left: ${p => p.isOverLeft ? "104px" : "4px"};
    position: relative;
`;

const TabInner = styled.div`
    background-color: ${p => p.selected ? getThemeProp(p, "tab.backgroundSelected") : getThemeProp(p, "tab.background")};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    padding: 0px 10px;
	border: 1px solid ${p => getThemeProp(p, "tab.border")};
    height: ${TAB_HEIGHT_NORMAL}px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    transition: all .25s;
    cursor: pointer;
    ${p => p.selected ? `
        height: ${TAB_HEIGHT_SELECTED}px;
        border-bottom: none;
    ` : ""}

    &:hover {
        background-color: ${p => getThemeProp(p, "tab.backgroundSelected")};
    }
`;

const TabContent = styled.span`
    transition: all .25s;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    pointer-events: none;
`;

const TabIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
    pointer-events: none;
`;

function OptionalMenu(props) {
    const { children, id, menu: Menu } = props;
    if (!Menu) {
        return (
            <>
                {children}
            </>
        );
    }
    return (
        <ContextMenu2 content={<Menu id={id} />}>
            {children}
        </ContextMenu2>
    );
}

export function Tab(props) {
    const {
        content,
        icon,
        id,
        menu,
        onClose,
        onDraggingChange,
        onSelect,
        onTabReorder,
        selected,
        tabDragging
    } = props;
    const theme = useTheme();
    const [wasDragging, setWasDragging] = useState(false);
    const handleClose = useCallback((event) => {
        event.stopPropagation();
        onClose()
    }, [onClose]);
    const handleClick = useCallback((event) => {
        if (event.button === 0) {
            event.preventDefault();
            onSelect();
        } else if (event.button === 1) {
            handleClose(event);
        }
    }, [handleClose, id, onSelect]);
    const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(() => ({
        type: "BOX",
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        item: {
            id
        }
    }));
    const [{ isOver: isOverLeft }, dropLeftRef] = useDrop(() => ({
        accept: "BOX",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        drop: (item) => {
            onTabReorder(item.id, -1);
        }
    }), [onTabReorder]);
    const [{ isOver: isOverRight }, dropRightRef] = useDrop(() => ({
        accept: "BOX",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        drop: (item) => {
            onTabReorder(item.id, 1);
            setWasDragging(false);
            onDraggingChange(id, false);
        }
    }), [onDraggingChange, onTabReorder]);
    useEffect(() => {
        if (isDragging && !wasDragging) {
            setWasDragging(true);
            onDraggingChange(id, true);
        } else if (!isDragging) {
            setWasDragging(false);
            onDraggingChange(id, false);
        }
    }, [id, isDragging, wasDragging, tabDragging]);
    return (
        <TabContainer isOverLeft={isOverLeft} isOverRight={isOverRight}>
            {tabDragging && (
                <DropTarget isOver={isOverLeft} ref={dropLeftRef} side="left">&nbsp;</DropTarget>
            )}
            <OptionalMenu id={id} menu={menu}>
                <TabInner
                    onClick={handleClick}
                    ref={isDragging ? dragPreviewRef : dragRef}
                    role="button"
                    selected={selected}
                    style={{ opacity: isDragging ? 0.5 : 1 }}
                >
                    <TabIcon src={icon} />
                    <TabContent>{content}</TabContent>
                    <Close
                        color={getThemeProp({ theme }, "tab.close")}
                        icon="small-cross"
                        onClick={handleClose}
                        role="button"
                    />
                </TabInner>
            </OptionalMenu>
            {tabDragging && (
                <DropTarget isOver={isOverRight} ref={dropRightRef} side="right">&nbsp;</DropTarget>
            )}
        </TabContainer>
    );
}
