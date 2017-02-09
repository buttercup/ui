import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import { Button } from '../src';

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
