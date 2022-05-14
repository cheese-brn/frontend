import {IconButton, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useNavigate} from "react-router-dom";

const PageHeader = ({header}) => {
  const navigate = useNavigate();
  return (<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1em'}}>
    <IconButton onClick={() => navigate(-1)} id='page-header__go-back-button'>
      <ArrowBackIcon/>
    </IconButton>
    <Typography variant='h4' align='left' id='page-header__header-text'>
      {header}
    </Typography>
  </div>)
}

export default PageHeader;