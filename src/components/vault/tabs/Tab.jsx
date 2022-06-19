import React, { useCallback, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Icon } from "@blueprintjs/core";
import styled, { useTheme } from "styled-components";
import { getThemeProp } from "../../../utils";

const Close = styled(Icon)`
    margin-left: 8px;
    padding: 3px;
    border-radius: 50%;

    &:hover {
        background-color: ${p => getThemeProp(p, "tab.closeBackgroundHover")};
    }
`;

const DropTarget = styled.div`
    height: 42px;
    position: absolute;
    width: calc(50% + 4px);
    ${p => p.side}: -4px;
    top: 0px;
    background: red;
`;

const TabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0 4px -1px 4px;
    position: relative;
`;

const TabInner = styled.div`
    background-color: ${p => p.selected ? getThemeProp(p, "tab.backgroundSelected") : getThemeProp(p, "tab.background")};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    padding: 0px 10px;
	border: 1px solid ${p => getThemeProp(p, "tab.border")};
    height: 42px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    transition: all .25s;
    cursor: pointer;
    ${p => p.selected ? `
        height: 45px;
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

export function Tab(props) {
    const {
        dragCtrlRef,
        selected,
        content,
        onClose,
        onTabReorder,
        onSelect,
        id,
        icon,
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
    const [, dropLeftRef] = useDrop(() => ({
        accept: "BOX",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        drop: (item) => {
            onTabReorder(item.id, -1);
        }
    }));
    const [, dropRightRef] = useDrop(() => ({
        accept: "BOX",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        drop: (item) => {
            onTabReorder(item.id, 1);
            setWasDragging(false);
            dragCtrlRef.current(id, false);
        }
    }));
    useEffect(() => {
        if (isDragging && !wasDragging) {
            setWasDragging(true);
            dragCtrlRef.current(id, true);
        } else if (!isDragging && tabDragging !== id) {
            setWasDragging(false);
        }
    }, [id, isDragging, wasDragging, tabDragging]);
    return (
        <TabContainer>
            {tabDragging && (
                <DropTarget ref={dropLeftRef} side="left">&nbsp;</DropTarget>
            )}
            <TabInner
                ref={isDragging ? dragPreviewRef : dragRef}
                style={{ opacity: isDragging ? 0.5 : 1 }}
                selected={selected}
                role="button"
                onClick={handleClick}
            >
                <TabIcon src={icon} />
                <TabContent>{content}</TabContent>
                <Close
                    icon="small-cross"
                    role="button"
                    onClick={handleClose}
                    color={getThemeProp({ theme }, "tab.close")}
                />
            </TabInner>
            {tabDragging && (
                <DropTarget ref={dropRightRef} side="right">&nbsp;</DropTarget>
            )}
        </TabContainer>
    );
}
