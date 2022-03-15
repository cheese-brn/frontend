import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';

// TODO: Добаботать стилизацию
// BUG: CardActionArea не заполняет всё пространство, при клике внизу карты может быть "подбородок"
const MenuRouteCard = ({ cardTitle, cardIconPath, route }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: '210px',
        height: '210px',
        margin: '20px',
        borderRadius: '5px',
      }}
      onClick={() => navigate(`/${route}`)}
      elevation={3}
    >
      <CardActionArea>
        <div
          style={{
            backgroundColor: '#26A69A',
            height: '120px',
            paddingTop: '10px',
          }}
        >
          <img src={cardIconPath} width="100px" alt='...'/>
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
    </Card>
  );
};

MenuRouteCard.propTypes = {
  cardTitle: PropTypes.string,
  cardIconPath: PropTypes.string,
  route: PropTypes.string,
};

export default MenuRouteCard;
