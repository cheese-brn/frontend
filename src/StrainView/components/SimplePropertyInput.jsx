/* eslint-disable react/prop-types */
import React, {useState, useEffect} from "react";
import {Typography, Button, Divider, TextField, Menu, MenuItem} from "@mui/material";

// TODO: разобраться с PropTypes
const SimplePropertyInput = props => {
  const { prop, readOnly, propertyIndex, valueChangeCallback, removePropCallback, addSubpropCallback } = props;
  const { name, subProps, } = prop;

  const [availableSubprops, setAvailableSubprops] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    fetch(`/subproperties/properties/${prop.id}`)
      .then(response => response.json())
      .then(subprops => {
        // мб здесь нужно немного не так
        if (subprops.length !== 1) {
          setAvailableSubprops(subprops);
        }
        if (subProps.length === 0) {
          addSubpropCallback(propertyIndex, subprops[0]);
        }
      });

  }, [])

  const smallButtonStyle = {
    padding: '0 4px 0 4px',
    minWidth: '30px',
    minHeight: '30px',
    marginLeft: '5px'
  };
  return(
    <div style={{border: '1px solid grey', borderRadius: '5px', alignItems: 'left', marginBottom: '15px', padding: '10px'}}
      onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant='p' sx={{fontSize: '18px'}}>{name}</Typography>

        <div style={{display: 'flex'}}>
          {!readOnly && availableSubprops !== null && hovered &&
          <div>
            <Button
              id={`simple-property-input__${propertyIndex}-add-subprop-button`}
              aria-controls={`simple-property-input__${propertyIndex}-add-subprop-menu`}
              aria-haspopup='true'
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              variant='contained'
              color='success'
              sx={smallButtonStyle}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              Добавить подсвойство
            </Button>
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
              {availableSubprops?.map((subprop, key) =>
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
          {!readOnly && hovered &&
          <Button
            variant='contained'
            color='error'
            sx={smallButtonStyle}
            onClick={() => removePropCallback(propertyIndex)}>
            Удалить свойство
          </Button>
          }
        </div>
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
        </div>
      )}
    </div>
  );
};

export default SimplePropertyInput;