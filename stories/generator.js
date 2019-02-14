import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { action } from '@storybook/addon-actions';
import MagicIcon from 'react-icons/lib/fa/magic';
import { Button, Generator } from '../src';
import styled from 'styled-components';

const View = styled.div`
  width: 100px;
  margin: 10px;
  border: 1px solid #777;
  border-radius: 5px;
  padding: 1em;
  text-align: center;
`;

export class GeneratorTrigger extends Component {
  state = {
    isOpen: false
  };

  handleClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleGenerated = (...args) => {
    this.setState({ isOpen: false });
    action('generated')(...args);
  };

  render() {
    return (
      <Generator onGenerate={this.handleGenerated} isOpen={this.state.isOpen} {...this.props}>
        <View>
          <Button
            primary
            danger={this.state.isOpen}
            icon={<MagicIcon />}
            onClick={this.handleClick}
          >
            Magic
          </Button>
        </View>
      </Generator>
    );
  }
}

export { GeneratorUserInterface } from '../src';
