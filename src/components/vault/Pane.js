import React from 'react';
import styled, { css } from 'styled-components';
import { ReflexElement } from 'react-reflex';
import { Tag, Colors, Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { getThemeProp } from '../../utils';

const createScrollShadow = color => css`
  /* Show shadow on scroll: https://gist.github.com/tbmiller/6675197 */
  background: linear-gradient(${color} 30%, hsla(0, 0%, 100%, 0)),
    linear-gradient(hsla(0, 0%, 100%, 0) 10px, ${color} 70%) bottom,
    radial-gradient(at top, rgba(0, 0, 0, 0.2), transparent 70%),
    radial-gradient(at bottom, rgba(0, 0, 0, 0.2), transparent 70%) bottom;
  background-repeat: no-repeat;
  background-size: 100% 20px, 100% 20px, 100% 10px, 100% 10px;
  background-attachment: local, local, scroll, scroll;
`;

const ListHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0.5rem;
  grid-area: header;
  border-bottom: 1px solid ${props => getThemeProp(props, 'colors.divider')};
`;
const ListHeading = styled.h2`
  font-weight: 300;
  margin: 0;
  flex: 1;
`;

export const Pane = styled(ReflexElement)`
  display: grid;
  grid-template-rows: 1fr;
`;

export const PaneContainer = styled.div`
  display: grid;
  overflow: auto;
  background-color: ${props =>
    props.primary && getThemeProp(props, 'colors.mainPaneBackground', Colors.LIGHT_GRAY5)};
  grid-template-rows: 55px 1fr 40px;
  grid-template-areas:
    'header'
    'body'
    'footer';
  ${props =>
    props.primary &&
    css`
      ${PaneContent} {
        ${createScrollShadow(getThemeProp(props, 'colors.mainPaneBackground', Colors.LIGHT_GRAY5))}
      }
    `};
`;

export const PaneContent = styled.div`
  grid-area: body;
  overflow: auto;
  padding: 0.5rem;
  margin: 0 ${p => (p.bleed ? '-0.5rem' : 0)};
  ${createScrollShadow('#fff')}
`;

export const PaneFooter = styled.div`
  grid-area: footer;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  border-top: 1px solid ${props => getThemeProp(props, 'colors.divider')};
`;

export const PaneHeader = ({ count, title, showFilter = false }) => {
  const renderMenu = (
    <Menu>
      <MenuItem text="Alphabetical" label="(a-z)" icon="sort-alphabetical" />
      <MenuItem text="Alphabetical" label="(z-a)" icon="sort-alphabetical-desc" />
      <MenuItem text="Filter..." icon="search-text" />
    </Menu>
  );
  return (
    <ListHeader>
      <ListHeading>{title}</ListHeading>
      <If condition={typeof count === 'number'}>
        <Tag minimal round>
          {count}
        </Tag>
      </If>
      <If condition={showFilter}>
        <Popover content={renderMenu}>
          <Button minimal icon="filter-list" />
        </Popover>
      </If>
    </ListHeader>
  );
};
