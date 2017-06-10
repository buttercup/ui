import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { generate, generateWords } from 'buttercup-generator';
import { colors } from '../variables';
import { selectElementContents } from '../utils';
import Popover from 'react-popover';
import { Button } from './button';
import { ColoredDigits } from './colored-digits';

const StyledPopover = styled(Popover)`
  .Popover-tip {
    fill: ${colors.DARK_SECONDARY};
  }

  .Popover-body {
    display: inline-flex;
    padding: 0;
    flex-direction: column;
  }
`;

const Password = styled(ColoredDigits)`
  .num {
    color: ${colors.BRAND_PRIMARY}
  }
`;

export class GeneratorBase extends Component {
  static propTypes = {
    onGenerate: PropTypes.func.isRequired
  }

  state = {
    type: 'characters',
    length: 30,
    symbols: true,
    numbers: true,
    letters: true,
    memorable: false,
    currentPassword: ''
  }
  
  componentDidMount() {
    this.generatePassword();
  }

  generatePassword() {
    let password;
    if (this.state.type === 'words') {
      password = generateWords();
    } else {
      password = generate(this.state.length, {
        symbols: this.state.symbols,
        letters: this.state.letters,
        numbers: this.state.numbers,
        memorable: this.state.memorable
      });
    }
    this.setState({
      currentPassword: password
    });
  }

  toggleOption(propName) {
    this.setState({ [propName]: !this.state[propName] }, () => {
      this.generatePassword();
    });
  }

  changeLength(e) {
    this.setState({ length: parseInt(e.target.value, 10) }, () => {
      this.generatePassword();
    });
  }

  changeType(type) {
    this.setState({ type }, () => {
      this.generatePassword();
    });
  }

  onGenerate() {
    const { onGenerate } = this.props;
    if (onGenerate) {
      onGenerate(this.state.currentPassword);
    }
  }

  renderBody() {
    return (
      <div className={this.props.className}>
        <pre className="password" role="content" onClick={e => selectElementContents(e.target)}>
          <Password value={this.state.currentPassword} />
        </pre>
        <div className="types">
          <label>
            <input
              type="radio"
              checked={this.state.type === 'characters'}
              onChange={() => this.changeType('characters')}
            /> Characters <small>(Recommended)</small>
          </label>
          <label>
            <input
              type="radio"
              checked={this.state.type === 'words'}
              onChange={() => this.changeType('words')}
            /> Words
          </label>
        </div>
        {this.state.type === 'characters' && <fieldset className="set">
          <legend>Options</legend>
          <label className="rangeLabel">
            <input
              type="range"
              value={this.state.length}
              min="10"
              max="50"
              onChange={e => this.changeLength(e)}
            />
            <span>{this.state.length}</span>
          </label>
          <label>
            <input
              type="checkbox"
              disabled={this.state.memorable}
              checked={this.state.letters}
              onChange={() => this.toggleOption('letters')}
            /> Letters
          </label>
          <label>
            <input
              type="checkbox"
              disabled={this.state.memorable}
              checked={this.state.numbers}
              onChange={() => this.toggleOption('numbers')}
            /> Numbers
          </label>
          <label>
            <input
              type="checkbox"
              disabled={this.state.memorable}
              checked={this.state.symbols}
              onChange={() => this.toggleOption('symbols')}
            /> Symbols
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.memorable}
              onChange={() => this.toggleOption('memorable')}
            /> Memorable
          </label>
        </fieldset>}
        <div className="buttons">
          <Button onClick={() => this.generatePassword()} primary>Generate</Button>
          <Button onClick={() => this.onGenerate()} dark>Use This</Button>
        </div>
      </div>
    );
  }

  render() {
    const { children, isOpen, className, ...rest } = this.props;
    return (
      <StyledPopover isOpen={isOpen} body={this.renderBody()} {...rest}>
        {children}
      </StyledPopover>
    );
  }
}

export const Generator = styled(GeneratorBase)`
  width: 300px;
  background: ${colors.DARK_SECONDARY};
  padding: 12px;
  color: #fff;
  border-radius: 5px;
  font-weight: 300;

  label {
    display: block;
  }

  .set {
    border-color: ${colors.WHITE_50};
    border-radius: 3px;

    legend {
      text-transform: uppercase;
      padding: 0 6px;
      font-size: .8em;
    }
  }

  .password {
    font-size: .9rem;
    padding: 6px;
    margin: 0;
    background-color: ${colors.BLACK_25};
    border-radius: 3px;
    overflow: hidden;
    font-weight: 400;
    cursor: copy;
  }

  .rangeLabel {
    display: flex !important;

    span {
      flex: 0;
      background-color: ${colors.BLACK_25};
      padding: 0 3px;
      border-radius: 3px;
      font-family: monospace;
      width: 30px;
      margin-left: 6px;
    }

    input {
      flex: 1;
    }
  }

  .buttons {
    display: flex;
    margin-top: 12px;
    align-items: flex-start;
    flex-direction: row;
    
    button {
      width: 50%;

      &:first-child {
        margin-right: 6px;
      }
    }
  }

  .types {
    margin: 12px 0;
    font-size: .9rem;

    label {
      display: block;
    }

    small {
      color: ${colors.GRAY_DARK};
    }
  }
`;
