import {
  Modal,
  Paper,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import React, {useMemo, useState,} from "react";
import CENTERED_MODAL from "../../constants";

import {useTable} from 'react-table';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  setter,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const onChange = e => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    let origData = rest.rows.map(row => row.original);
    origData[index][id] = parseFloat(value);
    setter(origData);
  }

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} style={{width: '100%'}}/>
}

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })
  return (
    <table {...getTableProps()} style={{borderCollapse: 'collapse'}}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
            })}
          </tr>
        )
      })}
      </tbody>
    </table>
  )
}

const CustomCell = ({instance, updateData, setter}) => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
  const {onClick, ...props } = bindTrigger(popupState);

  const rmbHandler = (click) => {
    if (click.button === 2) {
      click.preventDefault();
      onClick(click);
    }
  }

  const handleAdd = (position) => {
    let origData = instance.rows.map(row => row.original);
    if (position === 'top') {
      origData.splice(instance.row.index, 0, {first: 0, second: 0});
    } else {
      origData.splice(instance.row.index + 1, 0, {first: 0, second: 0});
    }
    setter(origData);
    popupState.close();
  }

  const handleDelete = () => {
    let origData = instance.rows.map(row => row.original);
    origData.splice(instance.row.index, 1);
    setter(origData);
    popupState.close();
  }

  return(
    <div onContextMenu={(e) => e.preventDefault()}>
      <div {...props} onMouseUp={rmbHandler}>
        <EditableCell {...instance} updateMyData={updateData} setter={setter} />
      </div>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={() => handleAdd('top')}>Добавить ряд сверху</MenuItem>
        <MenuItem onClick={() => handleAdd('bottom')}>Добавить ряд снизу</MenuItem>
        <MenuItem onClick={handleDelete}>Удалить ряд</MenuItem>
      </Menu>
    </div>
  )
}

const makeData = (data) => {
  const count = Math.min(data.firstParam.values.length, data.secondParam.values.length);
  let val = [];
  for (let i = 0; i < count; i++) {
    val.push({first: data.firstParam.values[i], second: data.second.values[i]})
  }

  if (val.length === 0) {
    val.push({first: 4, second: 5})
  }
  return(val);
}

const FunctionDataModal = ({open, closeCallback, data, edit}) => {
  const [tableData, setTableData] = useState(makeData(data));

  const addTableRow = (index, position) => {
    const dataCopy = JSON.parse(JSON.stringify(tableData));
    if (position === 'top') {
      dataCopy.splice(index, 0, {first: 0, second: 0});
    } else {
      dataCopy.splice(index + 1, 0, {first: 0, second: 0});
    }
    debugger
    setTableData(dataCopy);
  }

  const columns = useMemo(() => [
      {
        Header: `Ось X: ${data.firstParam?.name}, ${data.firstParam?.unit}`,
        accessor: 'first',
        Cell: inst => <CustomCell instance={inst} setter={setTableData} addTableRow={addTableRow}/>
      },
    {
      Header: `Ось Y: ${data.secondParam?.name}, ${data.secondParam?.unit}`,
      accessor: 'second',
      Cell: inst => <CustomCell instance={inst} setter={setTableData} addTableRow={addTableRow}/>
      },
  ], [data.firstParam, data.secondParam])

  const getSortedData = () => {
    const arrayCopy = JSON.parse(JSON.stringify(tableData)).sort((a, b) => a.first - b.first);
    return arrayCopy;
  }

  return (
    <Modal
      open={open}
      onClose={closeCallback}
      style={CENTERED_MODAL}
    >
      <Paper sx={{maxHeight: '70%', padding: '20px', overflowY: 'scroll',}}>
        <Typography
          variant='h5'
        >
          {`${edit ? 'Редактирование данных ' : 'Просмотр '}графика "${data.name}"`}
        </Typography>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
            <Table data={tableData} columns={columns}/>
          </div>
          <LineChart data={getSortedData()} width={300} height={300}>
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey='second' attributeName={data.secondParam.name} stroke="#8884d8" />
            <XAxis dataKey='first' />
            <YAxis />
            <Tooltip/>
          </LineChart>
        </div>
        <Divider/>
        {edit && <Button onClick={() => {
          const check = tableData;
          debugger
        }}>Сохранить данные</Button>}
      </Paper>
    </Modal>
  )
}

export default FunctionDataModal;