import React, {useState, useEffect} from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Popover, IconButton} from "@mui/material";

const InfoPopover = ({text, id}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return(
    <div>
      <IconButton
        onClick={(event) => {
          if (anchorEl) {
            setAnchorEl(null);
          } else {
            setAnchorEl(event.currentTarget)
          }
        }}
        aria-describedby={id}
      >
        <HelpOutlineIcon/>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        id={id}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <div style={{padding: '5px', maxWidth: '300px'}}>
          {text}
        </div>
      </Popover>
    </div>
  )
}

export default InfoPopover;