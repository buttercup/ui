import path from 'path';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Colors, Text, Classes } from '@blueprintjs/core';
import extractDomain from 'extract-domain';
import { EntryFacade } from './props';
import { getFacadeField, getThemeProp } from '../../utils';
import SiteIcon from './SiteIcon';

function getEntryDomain(entry) {
  const url = getFacadeField(entry, 'url');
  return url ? extractDomain(url) : null;
}

function title(entry) {
  const titleField = getFacadeField(entry, 'title');
  return titleField || <i>(Untitled)</i>;
}

const EntryWrapper = styled.div`
  padding: 0.5rem;
  user-select: none;
  cursor: pointer;
  border-radius: 3px;
  color: ${props =>
    props.selected ? getThemeProp(props, 'list.selectedTextColor', '#fff') : 'inherit'};
  background-color: ${props =>
    props.selected
      ? getThemeProp(props, 'list.selectedBackgroundColor', Colors.COBALT3)
      : 'transparent'};
  display: flex;
  align-items: center;
`;

const ImageWrapper = styled.figure`
  padding: 0;
  margin: 0;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  border: 1px solid ${Colors.GRAY5};
  border-radius: 3px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.4);
  margin-right: 1rem;
  flex: 0 0 2.5rem;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const SecondaryText = styled(Text)`
  opacity: 0.7;
  margin-top: 0.1rem;
`;

const ContentWrapper = styled.div`
  flex: 1;
  /*
   * flex issue
   * https://css-tricks.com/flexbox-truncated-text/
  */
  min-width: 0;
`;

const Entry = ({ entry, selected, onClick }) => (
  <EntryWrapper selected={selected} onClick={onClick}>
    <ImageWrapper>
      <SiteIcon domain={getEntryDomain(entry)} />
    </ImageWrapper>
    <ContentWrapper>
      <Text ellipsize>{title(entry)}</Text>
      <SecondaryText ellipsize className={Classes.TEXT_SMALL}>
        {getFacadeField(entry, 'username')}
      </SecondaryText>
    </ContentWrapper>
  </EntryWrapper>
);

Entry.propTypes = {
  entry: EntryFacade,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Entry;
