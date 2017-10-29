import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import filterReactDomProps from 'filter-react-dom-props';
import { darken } from 'polished';
import { colors } from '../variables';

function getBackgroundColor(props) {
  if (props.danger) {
    return colors.RED;
  } else if (props.primary) {
    return colors.BRAND_PRIMARY;
  } else if (props.dark) {
    return colors.BLACK_25;
  } else if (props.transparent) {
    return 'rgba(0,0,0,0)';
  }
  return colors.GRAY_LIGHT;
}

function getHoverColor(props) {
  if (props.dark) {
    return colors.BLACK_35;
  } else if (props.transparent) {
    return 'transparent';
  }
  return darken(0.05, getBackgroundColor(props));
}

function getTextColor(props) {
  if (props.danger || props.primary || props.dark) {
    return '#fff';
  }
  return 'buttontext';
}

function getSizes(props) {
  if (props.icon && !props.children) {
    return `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      padding: 6px 0;

      svg {
        width: 16px;
        height: 16px;
        margin-right: 0;
        vertical-align: -4px !important;
      }
    `;
  }
  return `
    border-radius: 20px;
    padding: ${props.large ? '8px' : '6px'} 12px;
    width: ${props.full ? '100%' : 'auto'};

    svg {
      font-size: ${props.large ? '16px' : '14px'};
      vertical-align: -3px !important;
      margin-right: 2px;
      cursor: pointer !important;
    }
  `;
}

const BaseButton = props => (
  <button type={props.type || 'button'} {...filterReactDomProps(props)}>
    {props.icon}
    {props.children}
  </button>
);

export const Button = styled(BaseButton)`
  display: inline-block;
  ${props => getSizes(props)} font-size: ${props =>
      props.large ? '.85rem' : '.75rem'};
  font-weight: 400;
  text-transform: uppercase;
  border: 0;
  cursor: pointer !important;
  outline: none;
  transition: background-color 0.2s ease;
  background-color: ${props => getBackgroundColor(props)};
  color: ${props => getTextColor(props)};
  box-sizing: border-box;

  &:hover {
    background-color: ${props => getHoverColor(props)};
  }

  &:active {
    position: relative;
    top: 1px;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`;

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.any,
  full: PropTypes.bool,
  primary: PropTypes.bool,
  danger: PropTypes.bool,
  dark: PropTypes.bool,
  transparent: PropTypes.bool,
  icon: PropTypes.node
};

export const ButtonRow = styled.div`
  display: inline-block;
  white-space: nowrap;

  > button,
  a {
    margin-right: 6px;

    &:last-child {
      margin-right: 0;
    }
  }
`;
