import React, { useMemo, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import cn from "classnames";
import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { DndProvider, HTML5Backend, Tabs } from "../src";
import { getThemeProp } from "../src/utils";
import themes from "../src/styles/themes";

import ICON_BUTTERCUP from "./resources/buttercup-256.png";
import ICON_DROPBOX from "./resources/dropbox-256.png";
import ICON_GOOGLEDRIVE from "./resources/googledrive-256.png";
import ICON_WEBDAV_WHITE from "./resources/webdav-white-256.png";

const INITIAL_TABS = [
    { id: "abc", content: "Tab 1", icon: ICON_BUTTERCUP },
    { id: "def", content: "Tab 2", icon: ICON_DROPBOX },
    { id: "ghi", content: "Tab 3", icon: ICON_GOOGLEDRIVE },
    { id: "jkl", content: "Tab 4", icon: ICON_WEBDAV_WHITE }
];

const View = styled.div`
    padding: 50px;
    background-color: ${p => getThemeProp(p, "colors.uiBackground")};
`;

function TabsMenu(props) {
    const { id } = props;
    return (
        <Menu>
            <MenuItem
                text="Unlock Vault"
                icon="unlock"
                onClick={() => console.log("Unlock item", id)}
            />
            <MenuItem text="Lock Vault" icon="lock" disabled />
            <MenuDivider />
            <MenuItem text="Remove Vault" icon="remove" />
        </Menu>
    );
}

export function TabsDark() {
    const initialTabs = useMemo(() => JSON.parse(JSON.stringify(INITIAL_TABS)), []);
    const [tabs, setTabs] = useState(initialTabs);
    const [selected, setSelected] = useState("abc");
    return (
        <ThemedView dark>
            <View>
                <Tabs
                    menu={TabsMenu}
                    onAdd={() =>
                        setTabs([
                            ...tabs,
                            {
                                id: Math.random().toString(),
                                content: `Tab ${tabs.length + 1}`,
                                icon: ICON_BUTTERCUP
                            }
                        ])
                    }
                    onClose={tabID => {
                        setTabs(tabs.filter(tab => tab.id !== tabID));
                    }}
                    onReorder={newTabs => {
                        setTabs(newTabs);
                    }}
                    onSelect={id => setSelected(id)}
                    selected={selected}
                    tabs={tabs}
                />
            </View>
        </ThemedView>
    );
}

export function TabsLight() {
    const initialTabs = useMemo(() => JSON.parse(JSON.stringify(INITIAL_TABS)), []);
    const [tabs, setTabs] = useState(initialTabs);
    const [selected, setSelected] = useState("abc");
    return (
        <ThemedView>
            <View>
                <Tabs
                    onAdd={() =>
                        setTabs([
                            ...tabs,
                            {
                                id: Math.random().toString(),
                                content: `Tab ${tabs.length + 1}`,
                                icon: ICON_BUTTERCUP
                            }
                        ])
                    }
                    onClose={tabID => {
                        setTabs(tabs.filter(tab => tab.id !== tabID));
                    }}
                    onReorder={newTabs => {
                        setTabs(newTabs);
                    }}
                    onSelect={id => setSelected(id)}
                    selected={selected}
                    tabs={tabs}
                />
            </View>
        </ThemedView>
    );
}

function ThemedView(params) {
    const { dark = false } = params;
    return (
        <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={dark ? themes.dark : themes.light}>
                <View
                    className={cn({
                        "bp4-dark": dark
                    })}
                >
                    {params.children}
                </View>
            </ThemeProvider>
        </DndProvider>
    );
}
