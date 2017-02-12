import React, { Component, PropTypes } from 'react';
import zxcvbn from 'zxcvbn';
import cx from 'classnames';
import styled from 'styled-components';
import WarningIcon from 'react-icons/lib/md/warning';
import InfoIcon from 'react-icons/lib/md/info';
import { colors } from '../variables';

class Meter extends Component {
  static propTypes = {
    input: PropTypes.string,
    className: PropTypes.string
  }

  state = {
    details: true
  }

  render() {
    const { input, className } = this.props;
    const result = zxcvbn(input);
    return (
      <div onClick={() => this.setState({ details: !this.state.details })} className={className}>
        <div className="wrapper">
          <div
            className={cx('barContent', `level${result.score}`)}
            style={{
              right: `${100 - (result.score * 25)}%`
            }}
          />
        </div>
        <div
          className="suggestions"
          style={{
            display: (this.state.details && (result.feedback.warning || result.feedback.suggestions.length > 0)) ?
              'block' : 'none'
          }}
        >
          {result.feedback.warning && <p><WarningIcon /> {result.feedback.warning}</p>}
          {result.feedback.suggestions.length > 0 && <p><InfoIcon /> {result.feedback.suggestions.join(' ')}</p>}
        </div>
      </div>
    );
  }
}

export default styled(Meter)`
  .wrapper {
    width: 100%;
    height: 5px;
    border-radius: 5px;
    position: relative;
    margin-top: 5px;
    background-color: ${colors.GRAY};
    cursor: pointer;
  }

  .barContent {
    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;
    border-radius: 5px;
    transition: right 50ms linear;
    cursor: pointer;
  }

  .level0 {}
  .level1 { background-color: ${colors.LEVEL_1} } 
  .level2 { background-color: ${colors.LEVEL_2} } 
  .level3 { background-color: ${colors.LEVEL_3} } 
  .level4 { background-color: ${colors.LEVEL_4} } 

  .suggestions {
    padding-top: 6px;
    line-height: 1.5em;
    font-size: .8em;
    font-weight: 300;

    > p {
      margin: 0 0 6px;

      > svg {
        vertical-align: -2px !important;
      }
    }
  }
`;
