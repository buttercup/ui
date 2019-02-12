import React from 'react';
import 'jest-styled-components';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Generator } from '../src/index.js';

Enzyme.configure({ adapter: new Adapter() });

describe('generator', () => {
  test('initial render remains consistent', () => {
    const container = mount(
      <Generator isOpen={true}>
        <a />
      </Generator>
    );
    expect(container).toMatchSnapshot();
  });
});
