import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { action } from '@storybook/react';
import { OTPDigits } from '../src';
import styled from 'styled-components';

const View = styled.div`
  width: 300px;
`;

export default class OTPDigitsStory extends Component {
  render() {
    return (
      <View>
        <OTPDigits otpURI="otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30" />
      </View>
    );
  }
}