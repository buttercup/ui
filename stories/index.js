import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import { Button } from '../src';
import GeneratorTrigger from './generator';
import MeterStory from './meter';

storiesOf('Button', module)
  .add('styles', () => (
    <div>
      <Button onClick={action('clicked')}>Default</Button>
      <hr/>
      <Button onClick={action('clicked')} primary>Primary</Button>
      <hr/>
      <Button onClick={action('clicked')} danger>Danger</Button>
      <hr/>
      <Button onClick={action('clicked')} dark>Dark</Button>
      <hr/>
      <Button onClick={action('clicked')} full dark>Full Dark</Button>
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
      <div style={{position: 'absolute', right: 0}}>
        <GeneratorTrigger />
      </div>
      <div style={{position: 'absolute', bottom: 0, left: 0}}>
        <GeneratorTrigger />
      </div>
      <div style={{position: 'absolute', left: 0}}>
        <GeneratorTrigger />
      </div>
      <div style={{position: 'absolute', bottom: 0, right: 0}}>
        <GeneratorTrigger />
      </div>
    </div>
  ));

storiesOf('Strength Meter', module)
  .add('default', () => (
    <MeterStory/>
  ));
