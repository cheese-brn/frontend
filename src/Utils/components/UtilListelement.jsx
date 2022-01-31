import React from "react";
import {Card, CardContent, Typography} from '@mui/material';
import {Link} from "react-router-dom";

const UtilListElement = ({label, link}) => {
  return(
    <Card>
      <Link to={`/${link}`} style={{ color: 'black', textDecoration: 'none' }}>
        <CardContent>
          <Typography variant='h5' align='left'>
            {label}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  )
};

export default UtilListElement;