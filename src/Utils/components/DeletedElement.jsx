import React, {useState} from "react";
import {Paper, Button, Typography} from "@mui/material";

const DeletedElement = ({label, onRestore}) =>{
  const [hovered, setHovered] = useState(false);
  return(
    <Paper
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{padding: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5px'}}
    >
      <Typography style={{fontSize: '20px'}}>
        {label}
      </Typography>
      {hovered &&
        <Button>
          <img src='/assets/restore-icon.png' width='20px' onClick={onRestore}/>
        </Button>
      }
    </Paper>
  )
}


export default DeletedElement;
