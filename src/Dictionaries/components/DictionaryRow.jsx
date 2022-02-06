/* eslint react/prop-types: 0 */
import React from 'react';
import { Typography, IconButton } from "@mui/material";
import { deleteItem, editItem } from "../constants";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import styles from '../styles.css'

// TODO: рассмотреть реализацию на css, добавить иконки
const DictionaryRow = ({data, dispatch}) => {
  return(
    <div
      className='dictionary-row'
    >
      <Typography sx={{fontSize: '22px'}}>
        {data.name}
      </Typography>
      <div className='dictionary-row-buttons' >
        <IconButton
          className='dictionary-button-edit'
          onClick={() => dispatch(editItem(data.id))}
        >
          <EditIcon/>
        </IconButton>
        <IconButton
          className='dictionary-button-delete'
          // onClick={() => dispatch(deleteItem(data.id))}
        >
          <DeleteOutlineIcon/>
        </IconButton>
      </div>
    </div>
  );
};

export default DictionaryRow;