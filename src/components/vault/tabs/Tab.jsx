import React, { useCallback } from "react";
import { useDrag } from "react-dnd";
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

const TabContainer = styled.div`
    background-color: ${p => p.selected ? getThemeProp(p, "tab.backgroundSelected") : getThemeProp(p, "tab.background")};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    margin: 0 8px -1px 0;
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
`;

const TabIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
`;

export function Tab(props) {
    const {
        selected,
        content,
        onClose,
        onSelect,
        id,
        icon
    } = props;
    const theme = useTheme();
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
        })
    }));
    return (
        <TabContainer
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
        </TabContainer>
    );
}
