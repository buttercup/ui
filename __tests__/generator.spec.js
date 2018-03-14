import React from 'react';
// import renderer from 'react-test-renderer';
// import ShallowRenderer from 'react-test-renderer/shallow';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Generator } from '../src/index.js';

describe('generator', () => {
  test('initial render remains consistent', () => {
    // const component = renderer.create(
    //   <Generator isOpen={true}>
    //     <a />
    //   </Generator>
    // );
    // let tree = component.toJSON();
    // expect(tree).toMatchSnapshot();

    // const renderer = new ShallowRenderer();
    // renderer.render(
    //   <Generator isOpen={true}>
    //     <a />
    //   </Generator>
    // );
    // const result = renderer.getRenderOutput();
    // expect(result).toMatchSnapshot();

    const wrapper = mount(
      <Generator isOpen={true}>
        <a />
      </Generator>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
