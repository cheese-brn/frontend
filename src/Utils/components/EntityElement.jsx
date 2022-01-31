import React from "react";
import {Paper, Typography} from "@mui/material";

const EntityElement = ({label, onClick}) => {
  return(
    <Paper onClick={onClick} style={{padding: '10px'}}>
      <Typography style={{fontSize: '20px'}}>
        {label}
      </Typography>
    </Paper>
  );
}

export default EntityElement;