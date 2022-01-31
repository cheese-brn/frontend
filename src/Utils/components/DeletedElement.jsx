import React from "react";
import {Paper, Typography} from "@mui/material";

const DeletedElement = ({label, onRestore}) =>
  <Paper
    onClick={onRestore}
    style={{padding: '10px'}}>
    <Typography style={{fontSize: '20px'}}>
      {label}
    </Typography>
  </Paper>

export default DeletedElement;
