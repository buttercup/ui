import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { TAB_HEIGHT_SELECTED, Tab } from "./Tab";
import { getThemeProp } from "../../../utils";

const TOP_PADDING = 4;

const TabContainer = styled.div`
    padding: ${TOP_PADDING}px 4px 0px 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    background-color: ${p => getThemeProp(p, "tab.barBackground")};
    height: ${TAB_HEIGHT_SELECTED + TOP_PADDING}px;
`;

export function Tabs(props) {
    const { onClose, onReorder, onSelect, selected, tabs } = props;
    const [dragging, setDragging] = useState(null);
    const handleDraggingChange = useCallback((tabID, isDragging) => {
        if (isDragging) {
            setDragging(tabID);
        } else if (!isDragging && dragging === tabID) {
            setDragging(null);
        }
    }, [tabs, dragging]);
    const handleReorder = useCallback((movedID, targetID, posChange) => {
        const originalIndex = tabs.findIndex(t => t.id === movedID);
        const targetIndex = tabs.findIndex(t => t.id === targetID);
        const output = [];
        for (let i = 0; i < tabs.length; i += 1) {
            if (i === targetIndex) {
                if (targetIndex === originalIndex) {
                    output.push(tabs[originalIndex]);
                } else if (posChange === -1) {
                    output.push(tabs[originalIndex], tabs[i]);
                } else if (posChange === 1) {
                    output.push(tabs[i], tabs[originalIndex]);
                }
                continue;
            }
            if (i === originalIndex) continue;
            output.push(tabs[i]);
        }
        onReorder(output);
        setDragging(false);
    }, [tabs]);
    return (
        <div>
            <TabContainer>
                {tabs.map((tab, i) => (
                    <Tab
                        content={tab.content}
                        icon={tab.icon}
                        id={tab.id}
                        index={i}
                        key={`${tab.id}-${i}`}
                        onClose={() => onClose(tab.id)}
                        onDraggingChange={handleDraggingChange}
                        onSelect={() => onSelect(tab.id)}
                        onTabReorder={(tabID, posChange) => handleReorder(tabID, tab.id, posChange)}
                        selected={tab.id === selected}
                        tabDragging={dragging}
                    />
                ))}
            </TabContainer>
        </div>
    );
}
