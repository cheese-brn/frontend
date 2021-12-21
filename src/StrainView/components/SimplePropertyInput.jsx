/* eslint-disable react/prop-types */
import React from "react";
import {Typography, Button, Divider, TextField} from "@mui/material";

// TODO: разобраться с PropTypes
const SimplePropertyInput = props => {
  const { prop, readOnly, propertyIndex, valueChangeCallback} = props;
  const {name, subProps, } = prop;

  const smallButtonStyle = {
    padding: '0 4px 0 4px',
    minWidth: '30px',
    minHeight: '30px',
    marginLeft: '5px'
  };
  return(
    <div style={{border: '1px solid grey', borderRadius: '5px', alignItems: 'left', marginBottom: '15px', padding: '10px'}}>
      <div style={{ display: 'flex',}}>
        <Typography variant='p' sx={{fontSize: '18px'}}>{name}</Typography>
        {!readOnly && <Button variant='contained' color='success' sx={smallButtonStyle}>+</Button>}
        {!readOnly && <Button variant='contained' color='error' sx={smallButtonStyle}>-</Button>}
      </div>
      {subProps.map((subProp, subPropertyIndex)=>
        <div key={`prop-${propertyIndex}-subprop-${subPropertyIndex}`} style={{textAlign: 'left', display: 'flex', flexDirection: 'column'}}>
          {readOnly && <Typography variant={'p'}>{`${subProp.name ? `${subProp.name}: ` : ``}${subProp.value}`}</Typography>}
          {!readOnly &&
						<>
						  <TextField
						    label={subProp.name}
						    value={subProp.value}
						    sx={{marginTop: '10px'}}
						    onChange={(event) => {
						      valueChangeCallback(propertyIndex, subPropertyIndex, event.target.value);
						    }}
						    multiline
						  />

						</>
          }
          <Divider/>
          <Divider/>
        </div>
      )}
    </div>
  );
};

export default SimplePropertyInput;