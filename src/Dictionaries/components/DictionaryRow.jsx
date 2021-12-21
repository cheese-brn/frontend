/* eslint react/prop-types: 0 */
import React, {useState} from 'react';
import {Typography, Button} from "@mui/material";
import {deleteItem, editItem} from "../constants";

const smallButtonStyle = {
  padding: '0 4px 0 4px',
  minWidth: '30px',
  minHeight: '30px',
  marginLeft: '5px'
}

// TODO: рассмотреть реализацию на css, добавить иконки
const DictionaryRow = ({data, dispatch}) => {
  const [hovered, setHovered] = useState(false);

  return(
    <div
      style={{display: 'flex', justifyContent: 'space-between'}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Typography sx={{fontSize: '22px'}}>
        {data.name}
      </Typography>
      {hovered &&
      <div className='dictionary-row-buttons' >
        <Button
          variant='contained'
          color='success'
          sx={smallButtonStyle}
          onClick={() => dispatch(editItem(data.id))}
        >
          изменить
        </Button>
        <Button
          variant='contained'
          color='error'
          sx={smallButtonStyle}
          onClick={() => dispatch(deleteItem(data.id))}
        >
          удалить
        </Button>
      </div>}
    </div>
  );
}

export default DictionaryRow;