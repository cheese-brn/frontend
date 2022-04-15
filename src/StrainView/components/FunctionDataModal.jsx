import {
  Modal,
  Paper,
  Typography,
  Button,
  Menu,
  MenuItem
} from "@mui/material";
import React, {useMemo, useState, useEffect, useCallback} from "react";
import CENTERED_MODAL from "../../constants";

import {useTable} from 'react-table';

import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    updateMyData(index, id, value)
  }

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}

const Table = ({ columns, data }) => {
  debugger
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

const CustomCell = ({instance, updateData, addTableRow}) => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
  const {onClick, ...props } = bindTrigger(popupState);

  const rmbHandler = (click) => {
    if (click.button === 2) {
      click.preventDefault();
      onClick(click);
    }
  }

  const handleAdd = (position) => {
    popupState.close();
    addTableRow(instance.row.index, position)
  }

  return(
    <div>
      <div {...props} onMouseUp={rmbHandler}>
        <EditableCell {...instance} updateMyData={updateData} />
      </div>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={() => handleAdd('top')}>Добавить ряд сверху</MenuItem>
        <MenuItem onClick={() => handleAdd('bottom')}>Добавить ряд снизу</MenuItem>
      </Menu>
    </div>
  )
}

const FunctionDataModal = ({open, closeCallback, data, edit}) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!data.firstParam || !data.secondParam) {
      return [{first: 0, second: 0}];
    }
    const count = Math.min(data.firstParam.values.length, data.secondParam.values.length);
    let val = [];
    for (let i = 0; i < count; i++) {
      val.push({first: data.firstParam.values[i], second: data.second.values[i]})
    }

    if (val.length === 0) {
      val.push({first: 4, second: 5})
    }
    setTableData(val);
  }, [data])

  useEffect(() => {
    let val = tableData
    debugger
  }, [tableData])

  const updateCellData = (index, id, value) => {
    debugger
    const dataCopy = JSON.parse(JSON.stringify(tableData));
    dataCopy[index][id] = value;
    setTableData(dataCopy);
  }

  const addTableRow = (index, position) => {
    const dataCopy = JSON.parse(JSON.stringify(tableData));
    if (position === 'top') {
      dataCopy.splice(index, 0, {first: 0, second: 0});
    } else {
      dataCopy.splice(index + 1, 0, {first: 0, second: 0});
    }
    setTableData(dataCopy);
  }

  const columns = useMemo(() => [
      {
        Header: `Ось X: ${data.firstParam?.name}`,
        accessor: 'first',
        Cell: inst => <CustomCell instance={inst} updateData={updateCellData} addTableRow={addTableRow}/>
      },
    {
      Header: `Ось Y: ${data.secondParam?.name}`,
      accessor: 'second',
      Cell: inst => <CustomCell instance={inst} updateData={updateCellData} addTableRow={addTableRow}/>
      },
  ], [data.firstParam, data.secondParam])

  return (
    <Modal
      open={open}
      onClose={closeCallback}
      style={CENTERED_MODAL}
    >
      <Paper sx={{width: '70%', maxHeight: '70%', padding: '20px', overflowY: 'scroll'}}>
        <Typography
          variant='h5'
        >
          {`${edit ? 'Редактирование данных ' : 'Просмотр '}графика "${data.name}"`}
        </Typography>
        <Table data={tableData} columns={columns}/>
        {edit && <Button onClick={() => {
          const check = data;
          debugger
        }}>Сохранить данные</Button>}
      </Paper>
    </Modal>
  )
}

export default FunctionDataModal;