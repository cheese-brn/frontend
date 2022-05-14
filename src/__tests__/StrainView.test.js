import React from 'react';
import { mount } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });

import StrainView from "../StrainView";
import {act} from "@testing-library/react";
jest.mock('../../node_modules/notistack', () => ({
  useSnackbar: () => ({enqueueSnackbar: () => {}})
}))
jest.mock('react-router-dom')
const rrd = require('react-router-dom');
rrd.useNavigate.mockImplementation(() => {})

describe('Strain download button testing', () => {
  it('When strainId is presented, button is available in read-only mode', () => {
    rrd.useParams.mockImplementation(() => ({strainId: 1}));
    const wrapper = mount(<StrainView/>)
    expect(wrapper.find('#strain-view__download-document-button').exists()).toBeTruthy();
  })
  it('When strainId is not presented, button is unavailable in read-only mode', () => {
    rrd.useParams.mockImplementation(() => ({strainId: null}));
    const wrapper = mount(<StrainView/>)
    expect(wrapper.find('#strain-view__download-document-button').exists()).not.toBeTruthy();
  })

  it('button is not available in edit mode', () => {
    rrd.useParams.mockImplementation(() => ({strainId: 1}));
    const wrapper = mount(<StrainView/>)
    act(() => wrapper.find('#strain-view__edit-button').at(0).props().onClick())

    wrapper.update()
    expect(wrapper.find('#strain-view__download-document-button').exists()).not.toBeTruthy();
  })
})