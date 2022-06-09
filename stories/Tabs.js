import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import cn from "classnames";
import { DndProvider, HTML5Backend, Tabs } from "../src";
import { getThemeProp } from "../src/utils";
import themes from "../src/styles/themes";

import ICON_BUTTERCUP from "./resources/buttercup-256.png";
import ICON_DROPBOX from "./resources/dropbox-256.png";
import ICON_GOOGLEDRIVE from "./resources/googledrive-256.png";
import ICON_WEBDAV_WHITE from "./resources/webdav-white-256.png";

const View = styled.div`
    padding: 50px;
    background-color: ${p => getThemeProp(p, "colors.uiBackground")};
`;

export function TabsDark() {
    const [selected, setSelected] = useState("abc");
    return (
        <ThemedView dark>
            <View>
                <Tabs
                    onSelect={id => setSelected(id)}
                    selected={selected}
                    tabs={[
                        { id: "abc", content: "Tab 1", icon: ICON_BUTTERCUP },
                        { id: "def", content: "Tab 2", icon: ICON_DROPBOX },
                        { id: "ghi", content: "Tab 3", icon: ICON_GOOGLEDRIVE },
                        { id: "jkl", content: "Tab 4", icon: ICON_WEBDAV_WHITE }
                    ]}
                />
            </View>
        </ThemedView>
    );
}

export function TabsLight() {
    const [selected, setSelected] = useState("abc");
    return (
        <ThemedView>
            <View>
                <Tabs
                    onSelect={id => setSelected(id)}
                    selected={selected}
                    tabs={[
                        { id: "abc", content: "Tab 1", icon: ICON_BUTTERCUP },
                        { id: "def", content: "Tab 2", icon: ICON_DROPBOX },
                        { id: "ghi", content: "Tab 3", icon: ICON_GOOGLEDRIVE },
                        { id: "jkl", content: "Tab 4", icon: ICON_WEBDAV_WHITE }
                    ]}
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
