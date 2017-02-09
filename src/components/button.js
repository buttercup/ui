import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { colors } from '../variables';

class Button extends Component {
  static propTypes = {
    type: PropTypes.string,
    children: PropTypes.node,
    icon: PropTypes.node,
    full: PropTypes.bool,
    primary: PropTypes.bool,
    danger: PropTypes.bool,
    dark: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.any
  }

  render() {
    const {
      children,
      type,
      full,
      primary,
      danger,
      disabled,
      dark,
      className,
      icon,
      ...rest
    } = this.props;
    return (
      <button
        className={cx(
          className,
          full && 'full',
          primary && 'primary',
          danger && 'danger',
          dark && 'dark',
          !children && 'icon'
        )}
        type={type || 'button'}
        {...rest}
        disabled={disabled}
        >
        {icon}{children}
      </button>
    );
  }
}

export default styled(Button)`
  display: inline-block;
  border-radius: 20px;
  font-size: .75rem;
  font-weight: 400;
  text-transform: uppercase;
  padding: 6px 12px;
  border: 0;
  cursor: pointer !important;
  outline: none;
  transition: background-color .2s ease;
  background-color: ${colors.GRAY_LIGHT};
  box-sizing: border-box;

  &:hover {
    background-color: ${colors.GRAY_LIGHT_DARKER};
  }

  &:active {
    position: relative;
    top: 1px;
  }

  svg {
    font-size: 14px;
    vertical-align: -3px !important;
    margin-right: 2px;
    cursor: pointer !important;
  }

  &[disabled] {
    opacity: .5;
    cursor: default;
  }

  &.full {
    width: 100%;
  }

  &.primary {
    background-color: ${colors.BRAND_PRIMARY};
    color: #fff;

    &:hover {
      background-color: ${colors.BRAND_PRIMARY_DARKER};
    }
  }

  &.dark {
    background-color: ${colors.BLACK_25};
    color: #fff;

    &:hover {
      background-color: ${colors.BLACK_35};
    }
  }

  &.danger {
    background-color: ${colors.RED};
    color: #fff;

    &:hover {
      background-color: ${colors.RED_DARKER};
    }
  }

  &.icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 6px 0;
  }

`;
