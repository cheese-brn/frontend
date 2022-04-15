/* eslint-disable react/prop-types */
import React, {useState, useEffect} from "react";
import {Typography, Divider, TextField, Menu, MenuItem, IconButton, Chip, Button} from "@mui/material";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ClearIcon from '@mui/icons-material/Clear';
import TimelineIcon from '@mui/icons-material/Timeline';

import styles from './styles.css';
import FunctionDataModal from "./FunctionDataModal";
import FunctionalSubproperty from "./FunctionalSubproperty";

// TODO: разобраться с PropTypes
const PropertyInput = props => {
  const { prop, readOnly, propertyIndex, valueChangeCallback, removePropCallback, addSubpropCallback, removeSubpropCallback } = props;
  const { name, subProps: currentSubProps, functions: currentFunctions} = prop;

  const [allSubprops, setAllSubprops] = useState(null);
  const [availableSubprops, setAvailableSubprops] = useState([]);
  const [allFunctions, setAllFunctions] = useState(null);
  const [availableFunctions, setAllAvailableFunctions] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  const [openGraphModal, setOpenGraphModal] = useState(false);
  const closeModal = () => {
    setOpenGraphModal(false);
    setGraphData([]);
  }

  useEffect(() => {
    fetch(`/subproperties/properties/${prop.id}`)
      .then(response => response.json())
      .then(subprops => {
        setAllSubprops(subprops.properties);
        setAllFunctions(subprops.functions);

        // TODO: Это тут автодобавление свойства
        // if (allSubprops.length === 1 && currentSubProps.length === 0) {
        //   addSubpropCallback(propertyIndex, allSubprops[0]);
        // }
      });
  }, [])

  useEffect(() => {
    setAvailableSubprops(allSubprops?.filter(
      subProp => !Boolean(currentSubProps.find(currSubProp => currSubProp.id === subProp.id))
    ) || []);
    setAllAvailableFunctions(allFunctions?.filter(
      func => !Boolean(currentFunctions.find(currFunc => currFunc.id === func.id))
    ) || []);
  }, [currentSubProps, allSubprops, currentFunctions, allFunctions])

  return(
    <>
      <div style={{border: '1px solid grey', borderRadius: '5px', alignItems: 'left', marginBottom: '15px', padding: '10px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant='p' sx={{fontSize: '18px'}}>{name}</Typography>

          <div style={{display: 'flex'}}>
            {!readOnly && [...availableSubprops, ...availableFunctions].length > 0 &&
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
                {[...availableSubprops, ...availableFunctions].map((child, id) =>
                  <MenuItem
                    key={`prop-${propertyIndex}-subprop-${id}`}
                    onClick={() => {
                      setAnchorEl(false);
                      addSubpropCallback(propertyIndex, child);
                    }}
                  >
                    {child.datatype ? null : <TimelineIcon />}
                    {child.name ? child.name : prop.name}
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

        {currentSubProps.map((subProp, subPropertyIndex)=>
          <div
            key={`prop-${propertyIndex}-subprop-${subPropertyIndex}`}
            style={{textAlign: 'left', display: 'flex', flexDirection: 'column'}}
          >
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

        {(currentFunctions || []).map((func, funcIndex) =>
          <FunctionalSubproperty data={func} propIndex={propertyIndex} funcIndex={funcIndex} readOnly={readOnly}/>
        )}

      </div>
    </>
  );
};

export default PropertyInput;