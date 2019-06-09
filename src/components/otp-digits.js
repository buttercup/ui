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
    otpURI: null,
    period: 30,
    timeLeft: 30
  };

  componentDidMount() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <DigitsContainer>
        {this.state.digits} ({this.state.timeLeft})
      </DigitsContainer>
    );
  }

  update(props = this.props) {
    let period = this.state.period;
    if (this.state.otpURI !== props.otpURI) {
      this.totp = OTPAuth.URI.parse(props.otpURI);
      period = this.totp.period;
      this.setState({
        otpURI: props.otpURI,
        period
      });
    }
    this.setState({
      digits: this.totp.generate(),
      timeLeft: period - (Math.floor(Date.now() / 1000) % period)
    });
  }
}
