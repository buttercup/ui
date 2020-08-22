import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import { Button, ColoredDigits } from '../src';
import { GeneratorTrigger, GeneratorUserInterface } from './generator';
import MeterStory from './meter';
import { BasicVault, BasicVaultFormatB, BasicDarkVault, HeavyVault } from './vault';
import OTPDigitsStory from './OTPDigits';
import '../src/styles/index.scss';

const Digits = styled(ColoredDigits)`
  .num {
    color: red;
  }
`;
const GeneratorUserInterfaceNoCorners = styled(GeneratorUserInterface)`
  border-radius: 0;
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
    <hr />
    <Button loading large>
      Loading Button
    </Button>{' '}
    <Button loading primary>
      Loading Button
    </Button>
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
  ))
  .add('body only', () => (
    <div>
      <GeneratorUserInterface />
    </div>
  ))
  .add('body only, no corners', () => (
    <div>
      <GeneratorUserInterfaceNoCorners />
    </div>
  ));

storiesOf('Strength Meter', module).add('default', () => <MeterStory />);

storiesOf('Colored Digits', module)
  .add('styled digits', () => <Digits value="Hello123HowAre1You" />)
  .add('concealed digits', () => <Digits value="Hello123HowAre1You" concealed />);

storiesOf('Vault', module)
  .add('basic (format A)', () => <BasicVault />)
  .add('basic (format B)', () => <BasicVaultFormatB />)
  .add('dark', () => <BasicDarkVault />)
  .add('heavy', () => <HeavyVault />);

storiesOf('OTPDigits', module)
  .add('6 digits', () => (
    <OTPDigitsStory uri="otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30" />
  ))
  .add('8 digits', () => (
    <OTPDigitsStory uri="otpauth://totp/Perry?secret=ababab&issuer=EA&algorithm=SHA1&digits=8&period=30" />
  ))
  .add('HOTP', () => (
    <OTPDigitsStory uri="otpauth://hotp/Gaming%20Login?secret=NBQWQYJAGIZTIM3W&issuer=EA&counter=0" />
  ));
