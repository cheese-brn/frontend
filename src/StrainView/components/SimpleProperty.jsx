import {TextField} from "@mui/material";
import React, {useState} from "react";
import {updateSimpleProp} from "../constants";

const SimpleProperty = ({id, label, name, value, readOnly, dispatch}) => {
  const [currVal, setVal] = useState(value);
  return(
    <TextField
      onBlur={() => dispatch(updateSimpleProp(name, currVal))}
      onChange={(event) => setVal(event.target.value)}
      sx={{marginBottom: '1rem'}}
      id={id}
      label={label}
      name={name}
      inputProps={{'readOnly': readOnly}}
      value={currVal}
      size='small'
    />
  )
}

export default SimpleProperty;