/* eslint-disable react/prop-types */
import React, {useState, useEffect} from "react";
import {Typography, Divider, TextField, Menu, MenuItem, IconButton} from "@mui/material";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ClearIcon from '@mui/icons-material/Clear';

import styles from './styles.css';

// TODO: разобраться с PropTypes
const SimplePropertyInput = props => {
  const { prop, readOnly, propertyIndex, valueChangeCallback, removePropCallback, addSubpropCallback, removeSubpropCallback } = props;
  const { name, subProps, } = prop;

  const [availableSubprops, setAvailableSubprops] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetch(`/subproperties/properties/${prop.id}`)
      .then(response => response.json())
      .then(availSubprops => {
        if (availSubprops.length !== 1) {
          setAvailableSubprops(availSubprops);
        }

        if (availSubprops.length === 1 && subProps.length === 0) {
          addSubpropCallback(propertyIndex, availSubprops[0]);
        }
      });

  }, [])

  return(
    <div style={{border: '1px solid grey', borderRadius: '5px', alignItems: 'left', marginBottom: '15px', padding: '10px'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant='p' sx={{fontSize: '18px'}}>{name}</Typography>

        <div style={{display: 'flex', }}>
          {!readOnly &&
          <div>
            <IconButton
              className='add-subproperty-button'
              id={`simple-property-input__${propertyIndex}-add-subprop-button`}
              aria-controls={`simple-property-input__${propertyIndex}-add-subprop-menu`}
              aria-haspopup='true'
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{padding: '0', marginRight: '5px'}}
            >
              <AddBoxIcon/>
            </IconButton>
            <Menu
              id={`simple-property-input__${propertyIndex}-add-subprop-menu`}
              aria-labelledby={`simple-property-input__${propertyIndex}-add-subprop-button`}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(false)}
              MenuListProps={{
                'aria-labelledby': `simple-property-input__${propertyIndex}-add-subprop-button`
              }}
            >
              {availableSubprops
                ?.filter(availSubprop => !Boolean(subProps.find(subProp => subProp.id === availSubprop.id)))
                .map((subprop, key) =>
                <MenuItem
                  key={`prop-${propertyIndex}-subprop-${key}`}
                  onClick={() => {
                    setAnchorEl(false);
                    addSubpropCallback(propertyIndex, subprop);
                  }}
                >
                  {subprop.name}
                </MenuItem>
              )}
            </Menu>
          </div>
          }
          {!readOnly &&
            <IconButton
              className='delete-property-button'
              onClick={() => removePropCallback(propertyIndex)}
              sx={{padding: '0'}}
            >
              <DeleteOutlineIcon/>
            </IconButton>
          }
        </div>
      </div>
      {subProps.map((subProp, subPropertyIndex)=>
        <div key={`prop-${propertyIndex}-subprop-${subPropertyIndex}`} style={{textAlign: 'left', display: 'flex', flexDirection: 'column'}}>
          {readOnly && <Typography variant={'p'}><i>{subProp.name ? `${subProp.name}: ` : ''}</i>{subProp.value}</Typography>}
          {!readOnly &&
						<div style={{display: 'flex', marginBottom: '5px'}}>
						  <TextField
						    label={subProp.name}
						    value={subProp.value}
						    sx={{marginTop: '10px', width: 'fill-available'}}
                size='small'
						    onChange={(event) => {
						      valueChangeCallback(propertyIndex, subPropertyIndex, event.target.value);
						    }}
						    multiline
						  />
						  <IconButton sx={{padding: '0px'}} onClick={() => removeSubpropCallback(propertyIndex ,subPropertyIndex)}>
                <ClearIcon/>
              </IconButton>
						</div>
          }
          <Divider/>
        </div>
      )}
    </div>
  );
};

export default SimplePropertyInput;