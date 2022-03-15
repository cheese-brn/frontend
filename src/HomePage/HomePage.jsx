import React, { useEffect, useState } from 'react';
import menuCardsContents from './constants';
import MenuRouteCard from './components/MenuRouteCard';
import LastStrainsCard from './components/LastStrainsCard';

import { Grid } from '@mui/material';

const HomePage = () => {
  const [menu, setMenu] = useState(null);
  // Это нужно получить с сервера
  const lastStrains = [
    {
      stainName: 'Штамм1',
      lastEdit: 'Вчера, 20:00',
      author: 'Иванов Иван Иванович',
      id: 0,
    },
    {
      stainName: 'Штамм2',
      lastEdit: '15 ноября, 20:00',
      author: 'Сидоров Сидор Сидорович',
      id: 1,
    },
    {
      stainName: 'Штамм3',
      lastEdit: '10 сентября, 20:00',
      author: 'Петров Пётр Петрович',
      id: 2,
    },
  ];

  useEffect(() => {
    const cards = [];
    Object.keys(menuCardsContents).forEach((card) => {
      cards.push(
        <MenuRouteCard
          id={`home-page__${menuCardsContents[card].id}-card`}
          key={menuCardsContents[card].id}
          cardTitle={menuCardsContents[card].title}
          cardIconPath={menuCardsContents[card].logo}
          route={menuCardsContents[card].route}
        />,
      );
    });
    setMenu(cards);
  }, []);

  return (
    <div >
      <Grid container spacing="2">
        {/*<Grid item sm="6" md="5" lg="4">*/}
        {/*  <LastStrainsCard strainsArray={lastStrains} />*/}
        {/*</Grid>*/}

        <Grid container justifyContent="left" spacing="1" sm="6" md="7" lg="8">
          {menu}
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
