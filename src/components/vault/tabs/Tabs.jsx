import React, { useCallback } from "react";
import styled from "styled-components";
import { Tab } from "./Tab";
import { getThemeProp } from "../../../utils";

const TabContainer = styled.div`
    padding: 12px 8px 0px 8px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    background-color: ${p => getThemeProp(p, "tab.barBackground")};
`;

export function Tabs(props) {
    const { onClose, onReorder, onSelect, selected, tabs } = props;
    const handleReorder = useCallback((movedID, targetID, posChange) => {
        let targetIndex = tabs.findIndex(t => t.id === targetID);
        targetIndex = posChange < 0 ? targetIndex : targetIndex + 1;
        console.log("REORDER", tabs.findIndex(t => t.id === targetID), posChange, targetIndex);
        onReorder(movedID, targetIndex);
    }, [tabs]);
    return (
        <div>
            <TabContainer>
                {tabs.map((tab, i) => (
                    <Tab
                        key={`${tab.id}-${i}`}
                        index={i}
                        id={tab.id}
                        icon={tab.icon}
                        content={tab.content}
                        selected={tab.id === selected}
                        onSelect={() => onSelect(tab.id)}
                        onClose={() => onClose(tab.id)}
                        onTabReorder={(tabID, posChange) => handleReorder(tabID, tab.id, posChange)}
                    />
                ))}
            </TabContainer>
        </div>
    );
}
