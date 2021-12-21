/* eslint-disable react/prop-types */
import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import {OPEN_ITEM} from '../constants';

const DictionaryTable = props => {
  const {columns, rows, dispatch} = props;
  return(
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(column =>
              <TableCell key={column.id} style={{minWidth: column.minWidth}}>
                {column.label}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row =>
            <TableRow hover role='button' key={row.id} onClick={() => dispatch({type: OPEN_ITEM, payload: row.id})}>
              <TableCell>
                {row.name}
              </TableCell>
              <TableCell>
                {row.childrenCount}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DictionaryTable;