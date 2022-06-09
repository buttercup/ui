import React from "react";
import { useDrop } from "react-dnd";
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
    const { onSelect, selected, tabs } = props;
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "BOX",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));
    return (
        <div>
            <TabContainer ref={drop}>
                {tabs.map((tab, i) => (
                    <Tab
                        key={tab.id}
                        index={i}
                        id={tab.id}
                        icon={tab.icon}
                        content={tab.content}
                        selected={tab.id === selected}
                        onSelect={() => onSelect(tab.id)}
                    />
                ))}
            </TabContainer>
        </div>
    );
}
