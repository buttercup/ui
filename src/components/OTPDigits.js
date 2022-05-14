import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Intent, Spinner, Text } from "@blueprintjs/core";
import * as OTPAuth from "otpauth";

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
    flex-wrap: none;
`;
const Digits = styled(Text)`
    font-family: monospace;
    font-size: 2em;
    word-break: keep-all;
`;
const TimeLeftSpinner = styled(Spinner)`
    margin-right: 8px;
`;

export default class OTPDigits extends Component {
    static defaultProps = {
        otpRef: n => n
    };

    static propTypes = {
        otpRef: PropTypes.func.isRequired,
        otpURI: PropTypes.string.isRequired
    };

    state = {
        digits: "",
        error: false,
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
                    <Choose>
                        <When
                            condition={
                                this.state.error ||
                                typeof this.state.period !== "number" ||
                                isNaN(this.state.timeLeft)
                            }
                        >
                            <TimeLeftSpinner
                                intent={Intent.DANGER}
                                size={Spinner.SIZE_SMALL}
                                value={1}
                            />
                            <DigitsContainer>
                                <Digits>ERROR</Digits>
                            </DigitsContainer>
                        </When>
                        <Otherwise>
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
                        </Otherwise>
                    </Choose>
                </With>
            </Container>
        );
    }

    update(props = this.props) {
        let period = this.state.period;
        try {
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
        } catch (err) {
            console.error(err);
            clearInterval(this.interval);
            this.setState({ error: true });
        }
    }
}
