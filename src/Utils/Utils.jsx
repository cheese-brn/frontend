import React from "react";
import {Typography} from "@mui/material";
import {utilsList} from "./constants";
import UtilListElement from "./components/UtilListelement";

const Utils = () => {
  return(
    <div>
      <Typography variant='h5' align='left'>
        Служебные утилиты:
      </Typography>
      {
        utilsList.map((util, index) => {
          return (<UtilListElement label={util.label} link={util.link} key={`util-${index}`}/>)
        })
      }
    </div>
  )
}

export default Utils;