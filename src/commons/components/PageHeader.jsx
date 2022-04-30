import {IconButton, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useNavigate} from "react-router-dom";


const PageHeader = ({header}) => {
  const navigate = useNavigate();
  return (<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1em'}}>
    <IconButton onClick={() => navigate(-1)}>
      <ArrowBackIcon/>
    </IconButton>
    <Typography variant='h4' align='left'>
      {header}
    </Typography>
  </div>)
}

export default PageHeader;