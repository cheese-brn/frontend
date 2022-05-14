import React from 'react';
import { mount } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });

import SimpleProperty from "../StrainView/components/SimpleProperty";

describe('Testing simple property field', () => {
  test('Without blur update callback is not called', () => {
    const updateCallback = jest.fn();
    const wrapper = mount(<SimpleProperty id='test' label='testProp' value='initVal' readOnly={true} updateCallback={updateCallback}/>);
    console.log(wrapper.debug())
    const elem = wrapper.find('#test-input');
    elem.simulate('focus')
    elem.simulate('change', {target: {value: 'changed text'}});
    expect(wrapper.find('#test-input').props().value).toEqual('changed text');
    expect(updateCallback.mock.calls.length).toBe(0);
  });
  test('After blur update callback is called once with latest input value', () => {
    const updateCallback = jest.fn();
    const wrapper = mount(<SimpleProperty name='test-name' id='test' label='testProp' value='initVal' readOnly={true} updateCallback={updateCallback}/>);
    const elem = wrapper.find('#test-input');
    elem.simulate('focus')
    elem.simulate('change', {target: {value: 'changed text'}});
    elem.simulate('change', {target: {value: 'changed text2'}});
    elem.simulate('change', {target: {value: 'changed text3'}});
    elem.simulate('blur')
    expect(updateCallback.mock.calls.length).toBe(1);
    expect(updateCallback).toBeCalledWith({target: {value: 'changed text3', name: 'test-name'}})
  })
})
