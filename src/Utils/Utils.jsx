import React from "react";
import {Paper, Typography} from "@mui/material";
import {utilsList} from "./constants";
import UtilListElement from "./components/UtilListelement";

const Utils = () => {
  return(
    <Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
      <Typography variant='h5' align='left'>
        Служебные утилиты:
      </Typography>
      {
        utilsList.map((util, index) => {
          return (<UtilListElement label={util.label} link={util.link} key={`util-${index}`}/>)
        })
      }
    </Paper>
  )
}

export default Utils;