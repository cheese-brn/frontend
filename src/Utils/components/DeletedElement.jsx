import React, {useState} from "react";
import {Paper, Typography, IconButton} from "@mui/material";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';

const DeletedElement = ({label, onRestore}) =>{
  const [hovered, setHovered] = useState(false);
  return(
    <Paper
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40px',
        marginBottom: '1em',
        paddingLeft: '1em'
      }}
    >
      <Typography style={{fontSize: '20px'}}>
        {label}
      </Typography>
      {hovered &&
        <IconButton onClick={onRestore}>
          <RestoreFromTrashIcon/>
        </IconButton>
      }
    </Paper>
  )
}


export default DeletedElement;
