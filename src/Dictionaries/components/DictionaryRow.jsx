/* eslint react/prop-types: 0 */
import React from 'react';
import { Typography, IconButton } from "@mui/material";
import { openEditModal } from "../constants";
import EditIcon from '@mui/icons-material/Edit';
import styles from '../styles.css'

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
          onClick={() => dispatch(openEditModal(data.id))}
        >
          <EditIcon/>
        </IconButton>
      </div>
    </div>
  );
};

export default DictionaryRow;