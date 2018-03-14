import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Generator } from '../src/index.js';

describe('generator', () => {
  test('initial render remains consistent', () => {
    const wrapper = mount(
      <Generator isOpen={true}>
        <a />
      </Generator>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
