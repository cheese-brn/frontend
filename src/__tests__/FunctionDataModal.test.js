import Enzyme, {mount} from 'enzyme';
import FunctionDataModal, {makeData} from "../StrainView/components/FunctionDataModal";

import {Button} from '@mui/material'
import {SnackbarProvider} from "notistack";

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });

describe('Data conversion testing', () => {
  test('Making table data from function info properly', () => {
    const givenData = {
      firstParam: {
        values: [1, 2, 3, 4, 5, 6],
      },
      secondParam: {
        values: [7, 8, 9, 10, 11, 12]
      }
    }
    const res = [
      {first: 1, second: 7},
      {first: 2, second: 8},
      {first: 3, second: 9},
      {first: 4, second: 10},
      {first: 5, second: 11},
      {first: 6, second: 12},
    ]
    expect(makeData(givenData)).toStrictEqual(res);
  })
  test('If a parameter has more data than another one, result is a minimal match', () => {
    const givenData = {
      firstParam: {
        values: [1, 2, 3, 4, 5, 6],
      },
      secondParam: {
        values: [7, 8, 9]
      }
    }
    const res = [
      {first: 1, second: 7},
      {first: 2, second: 8},
      {first: 3, second: 9},
    ]
    expect(makeData(givenData)).toStrictEqual(res);
  })
  })

  it('Function data saves correctly from table', () => {
    const givenData = {
      firstParam: {
        values: [1, 2, 3],
        name: 'firstParam',
      },
      secondParam: {
        values: [7, 8, 9],
        name: 'secondParam',
      }
    }
    const saveCallback = jest.fn();
    const wrapper = mount(
      <SnackbarProvider>
        <FunctionDataModal open={true} saveDataCallback={saveCallback} data={JSON.parse(JSON.stringify(givenData))} edit={true}/>
      </SnackbarProvider>
      )
    wrapper.find(Button).props().onClick();
    expect(saveCallback).toBeCalledWith(givenData);
  })



