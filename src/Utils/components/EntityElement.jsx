import React from "react";
import {Card, CardActionArea, Typography} from "@mui/material";

const EntityElement = ({label, onClick}) => {
  return(
    <Card onClick={onClick} style={{marginBottom: '1rem'}} elevation={4}>
      <CardActionArea style={{padding: '10px'}}>
        <Typography style={{fontSize: '20px'}}>
          {label}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

export default EntityElement;