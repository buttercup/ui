import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Intent, Spinner } from '@blueprintjs/core';
import * as OTPAuth from 'otpauth';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
`;
const DigitsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const Digits = styled.span`
  color: #222;
  font-family: monospace;
  font-size: 2em;
`;
const TimeLeftSpinner = styled(Spinner)`
  margin-right: 8px;
`;

export default class OTPDigits extends Component {
  static propTypes = {
    otpRef: PropTypes.func.isRequired,
    otpURI: PropTypes.string.isRequired
  };

  state = {
    digits: '',
    otpRef: () => {},
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
      <Container>
        <With
          leftDigits={this.state.digits.substring(0, this.state.digits.length / 2)}
          rightDigits={this.state.digits.substring(this.state.digits.length / 2)}
        >
          <TimeLeftSpinner
            intent={this.state.timeLeft > 7 ? Intent.PRIMARY : Intent.DANGER}
            size={Spinner.SIZE_SMALL}
            value={this.state.timeLeft / this.state.period}
          />
          <DigitsContainer>
            <Digits>{leftDigits}</Digits>
            &nbsp;
            <Digits>{rightDigits}</Digits>
          </DigitsContainer>
        </With>
      </Container>
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
    const digits = this.totp.generate();
    this.setState({
      digits,
      timeLeft: period - (Math.floor(Date.now() / 1000) % period)
    });
    this.props.otpRef(digits);
  }
}
