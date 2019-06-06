import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as OTPAuth from 'otpauth';

const DigitsContainer = styled.div`
  min-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default class OTPDigits extends Component {
  static propTypes = {
    otpURI: PropTypes.string.isRequired
  };

  state = {
    digits: '',
    otpURI: null
  };

  componentDidMount() {
    this.update();
  }

  render() {
    return <DigitsContainer>{this.state.digits}</DigitsContainer>;
  }

  update(props = this.props) {
    if (this.state.otpURI !== props.otpURI) {
      this.totp = OTPAuth.URI.parse(props.otpURI);
      this.setState({
        otpURI: props.otpURI
      });
    }
    this.setState({
      digits: this.totp.generate()
    });
  }
}
