import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { generatePassword, getConfig } from '@buttercup/generator';
import { colors } from '../variables';
import { selectElementContents } from '../utils';
import Popover from 'react-popover';
import { Button } from './button';
import { ColoredDigits } from './colored-digits';

const NOOP = () => {};

const StyledPopover = styled(Popover)`
  .Popover-tip {
    fill: ${colors.DARK_SECONDARY};
  }

  .Popover-body {
    width: 300px;
    display: inline-flex;
    padding: 0;
    flex-direction: column;
  }
`;
const Password = styled(ColoredDigits)`
  .num {
    color: ${colors.BRAND_PRIMARY};
  }
`;
const Body = styled.div`
  background: ${colors.DARK_SECONDARY};
  padding: 12px;
  color: #fff;
  border-radius: 5px;
  font-weight: 300;
`;
const PasswordContainer = styled.pre`
  font-size: 0.9rem;
  padding: 6px;
  margin: 0;
  background-color: ${colors.BLACK_25};
  border-radius: 3px;
  overflow: hidden;
  font-weight: 400;
  cursor: copy;
`;
const GenerationTypes = styled.div`
  margin: 12px 0;
  font-size: 0.9rem;

  label {
    display: block;
  }

  small {
    color: ${colors.GRAY_DARK};
  }
`;
const GeneratorLabel = styled.div`
  display: block;
`;
const GeneratorRangeLabel = styled.div`
  display: flex;

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
`;
const GeneratorFieldset = styled.fieldset`
  border-color: ${colors.WHITE_50};
  border-radius: 3px;
`;
const GeneratorLegend = styled.legend`
  text-transform: uppercase;
  padding: 0 6px;
  font-size: 0.8em;
`;
const GeneratorControls = styled.div`
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
`;

/**
 * Generator component
 */
export class GeneratorUserInterface extends Component {
  static propTypes = {
    onGenerate: PropTypes.func.isRequired
  };

  static defaultProps = {
    onGenerate: NOOP
  };

  state = {
    config: getConfig(),
    password: ''
  };

  characterSetEnabled(setName) {
    return this.state.config.randomCharacters.enabledCharacterSets.indexOf(setName) >= 0;
  }

  componentDidMount() {
    this.generatePassword();
  }

  generatePassword() {
    generatePassword(this.state.config)
      .then(password => {
        this.setState({
          password
        });
      })
      .catch(err => {
        // Errors for no selected character sets and max retries exceeded occur
        // when the user selects too-restrictive options - we don't really care
        // about the error, we just don't generate a password:
        if (err.code !== 'NO_CHARSETS' && err.code !== 'MAX_RETRIES') {
          // If it's some other error, throw it again
          throw err;
        }
      });
  }

  toggleCharacterSet(setName) {
    const currentCharacterSets = [...this.state.config.randomCharacters.enabledCharacterSets];
    const charsetIndex = currentCharacterSets.indexOf(setName);
    if (charsetIndex >= 0) {
      currentCharacterSets.splice(charsetIndex, 1);
    } else {
      currentCharacterSets.push(setName);
    }
    this.setState(
      {
        config: {
          ...this.state.config,
          randomCharacters: {
            ...this.state.config.randomCharacters,
            enabledCharacterSets: currentCharacterSets
          }
        }
      },
      () => {
        this.generatePassword();
      }
    );
  }

  changeLength(e) {
    this.setState(
      {
        config: {
          ...this.state.config,
          randomCharacters: {
            ...this.state.config.randomCharacters,
            length: parseInt(e.target.value, 10)
          }
        }
      },
      () => {
        this.generatePassword();
      }
    );
  }

  changeType(mode) {
    this.setState(
      {
        config: {
          ...this.state.config,
          mode
        }
      },
      () => {
        this.generatePassword();
      }
    );
  }

  onGenerate() {
    const { onGenerate } = this.props;
    if (onGenerate) {
      onGenerate(this.state.password);
    }
  }

  render() {
    return (
      <Body className={this.props.className}>
        <PasswordContainer role="content" onClick={e => selectElementContents(e.target)}>
          <Password value={this.state.password} />
        </PasswordContainer>
        <GenerationTypes>
          <GeneratorLabel>
            <input
              type="radio"
              checked={this.state.config.mode === 'characters'}
              onChange={() => this.changeType('characters')}
            />{' '}
            Characters
          </GeneratorLabel>
          <GeneratorLabel>
            <input
              type="radio"
              checked={this.state.config.mode === 'words'}
              onChange={() => this.changeType('words')}
            />{' '}
            Words
          </GeneratorLabel>
        </GenerationTypes>
        <If condition={this.state.config.mode === 'characters'}>
          <GeneratorFieldset>
            <GeneratorLegend>Options</GeneratorLegend>
            <GeneratorRangeLabel>
              <input
                type="range"
                value={this.state.config.randomCharacters.length}
                min="10"
                max="50"
                onChange={e => this.changeLength(e)}
              />
              <span>{this.state.length}</span>
            </GeneratorRangeLabel>
            <GeneratorLabel>
              <input
                type="checkbox"
                checked={this.characterSetEnabled('UPPERCASE')}
                onChange={() => this.toggleCharacterSet('UPPERCASE')}
              />{' '}
              Uppercase Letters
            </GeneratorLabel>
            <GeneratorLabel>
              <input
                type="checkbox"
                checked={this.characterSetEnabled('LOWERCASE')}
                onChange={() => this.toggleCharacterSet('LOWERCASE')}
              />{' '}
              Lowercase Letters
            </GeneratorLabel>
            <GeneratorLabel>
              <input
                type="checkbox"
                checked={this.characterSetEnabled('DIGITS')}
                onChange={() => this.toggleCharacterSet('DIGITS')}
              />{' '}
              Digits
            </GeneratorLabel>
            <GeneratorLabel>
              <input
                type="checkbox"
                checked={this.characterSetEnabled('SPACE')}
                onChange={() => this.toggleCharacterSet('SPACE')}
              />{' '}
              Space
            </GeneratorLabel>
            <GeneratorLabel>
              <input
                type="checkbox"
                checked={this.characterSetEnabled('UNDERSCORE_DASH')}
                onChange={() => this.toggleCharacterSet('UNDERSCORE_DASH')}
              />{' '}
              Underscore &amp; Dash
            </GeneratorLabel>
            <GeneratorLabel>
              <input
                type="checkbox"
                checked={this.characterSetEnabled('SYMBOLS')}
                onChange={() => this.toggleCharacterSet('SYMBOLS')}
              />{' '}
              Symbols
            </GeneratorLabel>
          </GeneratorFieldset>
        </If>
        <GeneratorControls>
          <Button onClick={() => this.generatePassword()} primary>
            Generate
          </Button>
          <Button onClick={() => this.onGenerate()} dark>
            Use This
          </Button>
        </GeneratorControls>
      </Body>
    );
  }
}

/**
 * Generator component in a popover
 * @augments GeneratorUserInterface
 * @see GeneratorUserInterface
 */
export class Generator extends GeneratorUserInterface {
  render() {
    const { children, isOpen, className, ...rest } = this.props;
    return (
      <StyledPopover isOpen={isOpen} body={super.render()} className={className} {...rest}>
        {children}
      </StyledPopover>
    );
  }
}
