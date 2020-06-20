import React, { Component } from 'react';
import { OTPDigits } from '../src';
import styled from 'styled-components';

const View = styled.div`
  width: 300px;
`;

export default class OTPDigitsStory extends Component {
  render() {
    return (
      <View>
        <OTPDigits otpURI={this.props.uri} />
      </View>
    );
  }
}
