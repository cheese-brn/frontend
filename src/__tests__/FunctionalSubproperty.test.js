import React from 'react';
import FunctionalSubproperty from "../StrainView/components/FunctionalSubproperty";
import {Button} from '@mui/material'
import { mount } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });

it('Edit graph button is not present in readonly mode', () => {
  const data = {name: 'test func'}
  const wrapper = mount(<FunctionalSubproperty readOnly={true} data={data}/>);
  wrapper.debug()
  const val = wrapper.find(Button)
  expect(wrapper.find(Button)).toHaveLength(0);
})