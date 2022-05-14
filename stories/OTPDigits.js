import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import cn from "classnames";
import { OTPDigits } from "../src";
import { getThemeProp } from "../src/utils";
import themes from "../src/styles/themes";

const View = styled.div`
    padding: 50px;
    background-color: ${p => getThemeProp(p, "colors.uiBackground")};
`;

export class OTPDigitsDark extends Component {
    render() {
        return (
            <ThemedView dark>
                <View>
                    <OTPDigits otpURI={this.props.uri} />
                </View>
            </ThemedView>
        );
    }
}

export class OTPDigitsLight extends Component {
    render() {
        return (
            <ThemedView>
                <View>
                    <OTPDigits otpURI={this.props.uri} />
                </View>
            </ThemedView>
        );
    }
}

function ThemedView(params) {
    const { dark = false } = params;
    return (
        <ThemeProvider theme={dark ? themes.dark : themes.light}>
            <View
                className={cn({
                    "bp4-dark": dark
                })}
            >
                {params.children}
            </View>
        </ThemeProvider>
    );
}
