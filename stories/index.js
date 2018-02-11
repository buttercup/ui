import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import styled from 'styled-components';
import { Button, ColoredDigits } from '../src';
import GeneratorTrigger from './generator';
import MeterStory from './meter';

const Digits = styled(ColoredDigits)`
  .num {
    color: red;
  }
`;

storiesOf('Button', module).add('styles', () => (
  <div>
    <Button onClick={action('clicked')}>Default</Button>
    <hr />
    <Button onClick={action('clicked')} primary>
      Primary
    </Button>
    <hr />
    <Button onClick={action('clicked')} danger>
      Danger
    </Button>
    <hr />
    <Button onClick={action('clicked')} dark>
      Dark
    </Button>
    <hr />
    <Button onClick={action('clicked')} full dark>
      Full Dark
    </Button>
    <hr />
    <Button onClick={action('clicked')} large>
      Large Button
    </Button>
    <hr />
    <Button
      onClick={action('clicked')}
      danger
      icon={
        <svg
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          height="1em"
          width="1em"
          viewBox="0 0 40 40"
        >
          <g>
            <path d="m5 21.6v-3.2h20v3.2h-20z m0-11.6h30v3.4h-30v-3.4z m0 20v-3.4h10v3.4h-10z" />
          </g>
        </svg>
      }
    />{' '}
    Icon Only
  </div>
));

storiesOf('Generator', module)
  .add('prefer below', () => (
    <div style={{ position: 'absolute', left: 0 }}>
      <GeneratorTrigger preferPlace="below" />
    </div>
  ))
  .add('edges of screen (auto)', () => (
    <div>
      <div style={{ position: 'absolute', right: 0 }}>
        <GeneratorTrigger />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
        <GeneratorTrigger />
      </div>
      <div style={{ position: 'absolute', left: 0 }}>
        <GeneratorTrigger />
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <GeneratorTrigger />
      </div>
    </div>
  ));

storiesOf('Strength Meter', module).add('default', () => <MeterStory />);

storiesOf('Colored Digits', module)
  .add('styled digits', () => <Digits value="Hello123HowAre1You" />)
  .add('concealed digits', () => (
    <Digits value="Hello123HowAre1You" concealed />
  ));
