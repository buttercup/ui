import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { Tag, Button, Popover, Menu, MenuItem, InputGroup, Classes, Icon } from "@blueprintjs/core";
import { getThemeProp } from "../../utils";
import { useTranslations } from "../../hooks/i18n";

const NOOP = () => {};

const createScrollShadow = color => css`
    /* Show shadow on scroll: https://gist.github.com/tbmiller/6675197 */
    background: linear-gradient(${color} 30%, rgba(255, 255, 255, 0)) 0% 0% / 100% 10px no-repeat
            local,
        linear-gradient(rgba(255, 255, 255, 0) 0px, ${color} 70%) center bottom / 100% 10px local,
        radial-gradient(at center top, rgba(0, 0, 0, 0.2), transparent 70%) 0% 0% / 100% 5px scroll,
        radial-gradient(at center bottom, rgba(0, 0, 0, 0.2), transparent 70%) center bottom / 100%
            5px scroll;
    background-repeat: no-repeat;
    background-size: 100% 10px, 100% 10px, 100% 5px, 100% 5px;
    background-attachment: local, local, scroll, scroll;
`;

const ListHeader = styled.header`
    display: flex;
    align-items: center;
    padding: 1rem 1rem 0.5rem;
    grid-area: header;
    border-bottom: 1px solid ${props => getThemeProp(props, "colors.divider")};
`;
const ListHeading = styled.h2`
    font-weight: 300;
    margin: 0;
    flex: 1;
`;
const ListHeadingContent = styled.div`
    flex: 1;
    display: flex;
    display: flex;
    align-items: center;
    margin-right: 5px;
`;

export const Pane = styled.section`
    display: grid;
    grid-template-rows: 1fr;
`;

export const PaneContainer = styled.div`
    display: grid;
    overflow: hidden;
    height: 100%;
    background-color: ${props => props.primary && getThemeProp(props, "colors.mainPaneBackground")};
    grid-template-rows: 55px 1fr 50px;
    grid-template-areas:
        "header"
        "body"
        "footer";
    ${props =>
        props.primary &&
        css`
            ${PaneContent} {
                ${createScrollShadow(getThemeProp(props, "colors.mainPaneBackground"))}
            }
        `};
`;

export const PaneContent = styled.div`
    grid-area: body;
    overflow: auto;
    padding: 0.5rem;
    margin: 0 ${p => (p.bleed ? "-0.5rem" : 0)};
    width: 100%;
    position: relative;
    ${props => createScrollShadow(getThemeProp(props, "colors.uiBackground"))}
`;

export const PaneFooter = styled.div`
    grid-area: footer;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    border-top: 1px solid ${props => getThemeProp(props, "colors.divider")};
`;

export const PaneHeader = ({
    count,
    title,
    filter = null,
    onAddItem = NOOP,
    onTermChange = NOOP,
    onSortModeChange = NOOP,
    readOnly = false
}) => {
    const [filterInputVisible, toggleFilter] = useState(false);
    const inputRef = useRef(null);
    const showFilter = filter !== null;
    const t = useTranslations();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [filterInputVisible]);

    const clearSearch = () => onTermChange("");
    const handleInputKeyPress = e => {
        if (e.key.toLowerCase() === "escape") {
            clearSearch();
            toggleFilter(false);
        }
    };

    const checkedIcon = <Icon icon="small-tick" />;

    const renderMenu = (
        <Menu>
            <MenuItem
                text={t("entries-list.sort.alphabetical-asc")}
                label={filter && filter.sortMode === "az" ? checkedIcon : ""}
                icon="sort-alphabetical"
                onClick={() => onSortModeChange("az")}
            />
            <MenuItem
                text={t("entries-list.sort.alphabetical-desc")}
                label={filter && filter.sortMode === "za" ? checkedIcon : ""}
                icon="sort-alphabetical-desc"
                onClick={() => onSortModeChange("za")}
            />
            <MenuItem
                text={t("entries-list.sort.filter")}
                icon="search-text"
                onClick={() => toggleFilter(!filterInputVisible)}
                disabled={filter && filter.term !== ""}
            />
        </Menu>
    );
    return (
        <ListHeader>
            <ListHeadingContent>
                <Choose>
                    <When
                        condition={
                            (filterInputVisible && showFilter) || (filter && filter.term !== "")
                        }
                    >
                        <InputGroup
                            small
                            className={Classes.FILL}
                            leftIcon="search"
                            type="search"
                            placeholder={t("entries-list.filter-placeholder")}
                            value={filter.term}
                            onChange={e => onTermChange(e.target.value)}
                            onKeyDown={handleInputKeyPress}
                            inputRef={ref => (inputRef.current = ref)}
                        />
                    </When>
                    <Otherwise>
                        <ListHeading>{title}</ListHeading>
                        <If condition={typeof count === "number"}>
                            <Tag minimal round>
                                {count}
                            </Tag>
                        </If>
                    </Otherwise>
                </Choose>
            </ListHeadingContent>
            <If condition={onAddItem !== NOOP}>
                <Button minimal icon="add" small onClick={onAddItem} disabled={readOnly} />
            </If>
            <If condition={showFilter}>
                <Popover content={renderMenu}>
                    <Button minimal icon="filter-list" small />
                </Popover>
            </If>
        </ListHeader>
    );
};
