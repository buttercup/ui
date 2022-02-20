import PropTypes from "prop-types";
import React, { Component } from "react";

export const ColoredDigits = ({ value, concealed, ...props }) => {
    const splitted = value.split(/(\d+)/g);
    return (
        <span {...props}>
            {concealed
                ? "●".repeat(10)
                : splitted.map((chunk, i) => (
                      <span key={i} className={/^\d+$/.test(chunk) ? "num" : "str"}>
                          {chunk}
                      </span>
                  ))}
        </span>
    );
};

ColoredDigits.propTypes = {
    value: PropTypes.string,
    concealed: PropTypes.bool
};
