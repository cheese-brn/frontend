/*eslint no-unused-vars: "warn"*/
import React from 'react';
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import PropTypes from 'prop-types';

// TODO: Добаботать стилизацию
const MenuRouteCard = ({cardTitle, cardIconPath, }) => {
  return(
    <Card sx={{ width: '210px', height: '210px', margin: '20px', borderRadius: '5px'}}>
      <CardActionArea>
        <div style={{backgroundColor: '#26A69A', height: '120px', paddingTop: '10px'}}>
          <img src={cardIconPath} width='100px'/>
        </div>
        <CardContent>
          <Typography variant='h5' component='div' align='left' sx={{lineHeight: '25px'}}>
            {cardTitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

MenuRouteCard.propTypes = {
  cardTitle: PropTypes.string,
  cardIconPath: PropTypes.string,
}

export default MenuRouteCard;