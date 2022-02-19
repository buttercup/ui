import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import filterReactDomProps from "filter-react-dom-props";
import { darken } from "polished";
import { colors } from "../variables";

function getBackgroundColor(props) {
    if (props.danger) {
        return colors.RED;
    } else if (props.primary) {
        return colors.BRAND_PRIMARY;
    } else if (props.dark) {
        return colors.BLACK_25;
    } else if (props.transparent) {
        return "rgba(0,0,0,0)";
    }
    return colors.GRAY_LIGHT;
}

function getHoverColor(props) {
    if (props.dark) {
        return colors.BLACK_35;
    } else if (props.transparent) {
        return "transparent";
    }
    return darken(0.05, getBackgroundColor(props));
}

function getTextColor(props) {
    if (props.danger || props.primary || props.dark) {
        return "white";
    }
    return "buttontext";
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
    padding: ${props.large ? "8px" : "6px"} 12px;
    width: ${props.full ? "100%" : "auto"};

    svg {
      font-size: ${props.large ? "16px" : "14px"};
      vertical-align: -3px !important;
      margin-right: 2px;
      cursor: pointer !important;
    }
  `;
}

function getLoadingState(props) {
    const size = props.large ? 30 : 24;
    const color = getTextColor(props);
    if (!props.loading) {
        return;
    }
    return `
    color: transparent;

    &:after {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${color}" d="M54.782 27.503c-12.423-2.64-24.639 5.293-27.28 17.715s5.294 24.639 17.716 27.28m.81-3.815c-10.27-2.183-16.914-12.286-14.71-22.654S43.7 29.134 53.97 31.317"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"/></path></svg>');
      display: block;
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      height: ${size}px;
      width: ${size}px;
      transform: translate(-50%, -50%);
    }
  `;
}

const BaseButton = props => (
    <button type={props.type || "button"} {...filterReactDomProps(props)}>
        {props.icon}
        {props.children}
    </button>
);

export const Button = styled(BaseButton)`
    display: inline-block;
    ${props => getSizes(props)};
    font-size: ${props => (props.large ? ".85rem" : ".75rem")};
    font-weight: 400;
    text-transform: uppercase;
    border: 0;
    cursor: pointer !important;
    outline: none;
    transition: background-color 0.2s ease;
    background-color: ${props => getBackgroundColor(props)};
    color: ${props => getTextColor(props)};
    box-sizing: border-box;
    position: relative;

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

    ${props => getLoadingState(props)};
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
