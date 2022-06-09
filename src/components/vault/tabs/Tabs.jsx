import React, { useCallback } from "react";
import styled from "styled-components";
import { Tab } from "./Tab";
import { getThemeProp } from "../../../utils";

const TabContainer = styled.div`
    padding: 12px 12px 0px 12px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    background-color: ${p => getThemeProp(p, "tab.barBackground")};
`;

export function Tabs(props) {
    const { onClose, onReorder, onSelect, selected, tabs } = props;
    const handleReorder = useCallback((movedID, targetID) => {
        const originIndex = tabs.findIndex(t => t.id === movedID);
        let targetIndex = tabs.findIndex(t => t.id === targetID);
        if (targetIndex > originIndex) {
            targetIndex -= 1;
        }
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
                        onTabReorder={tabID => handleReorder(tabID, tab.id)}
                    />
                ))}
            </TabContainer>
        </div>
    );
}
