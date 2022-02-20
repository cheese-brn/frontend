import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// TODO: Добаботать стилизацию
// BUG: CardActionArea не заполняет всё пространство, при клике внизу карты может быть "подбородок"
const MenuRouteCard = ({ cardTitle, cardIconPath, route }) => {
  return (
    <Card
      sx={{
        width: '210px',
        height: '210px',
        margin: '20px',
        borderRadius: '5px',
      }}
    >
      <Link to={`/${route}`} style={{ color: 'black', textDecoration: 'none' }}>
        <CardActionArea>
          <div
            style={{
              backgroundColor: '#26A69A',
              height: '120px',
              paddingTop: '10px',
            }}
          >
            <img src={cardIconPath} width="100px" />
          </div>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              align="left"
              sx={{ lineHeight: '25px' }}
            >
              {cardTitle}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

MenuRouteCard.propTypes = {
  cardTitle: PropTypes.string,
  cardIconPath: PropTypes.string,
  route: PropTypes.string,
};

export default MenuRouteCard;
