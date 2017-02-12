import React, { Component, PropTypes } from 'react';
import { action } from '@kadira/storybook';
import { Meter } from '../src';
import styled from 'styled-components';

const View = styled.div`
  width: 300px;
`;

const Input = styled.input`
  line-height: 30px;
  height: 30px;
  border: 1px solid #ededed;
  padding: 0 5px;
  display: block;
  width: 100%;
  box-sizing: border-box;
`;

export default class MeterStory extends Component {
  state = {
    input: ''
  }

  handleChange = e => {
    this.setState({
      input: e.target.value
    });
  }

  render() {
    return (
      <View>
        <Input placeholder="Type here..." onChange={this.handleChange} value={this.state.value}/>
        <Meter input={this.state.input}/>
      </View>
    )
  }
}
