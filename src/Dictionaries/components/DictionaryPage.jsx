/* eslint-disable react/prop-types */
import React from "react";
import {Card, CardActionArea, Typography} from "@mui/material";

const cardStyle = {
  width: '140px',
  height: '50px',
  margin: '20px',
  borderRadius: '5px',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
// TODO: Разобраться с PropTypes
const DictionaryPage = (props) =>{
  const {displayName, onClick} = props;
  return(
    <Card sx={ cardStyle }>
      <CardActionArea sx={{width: '100%', height: '100%'}} onClick={onClick}>
        <Typography variant='h5'>
          {displayName}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default DictionaryPage;