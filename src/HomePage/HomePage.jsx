import React, { useEffect, useState } from 'react';
import menuCardsContents from './constants';
import MenuRouteCard from './components/MenuRouteCard';
import LastStrainsCard from './components/LastStrainsCard';

import { Paper, Grid, Button } from '@mui/material';
// TODO: Сделать layout правильно
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
    <Paper sx={{ margin: '0 10px 0 10px', padding: '10px' }}>
      <Grid container spacing="2">
        <Grid item sm="6" md="5" lg="4">
          <LastStrainsCard strainsArray={lastStrains} />
        </Grid>

        <Grid container justifyContent="left" spacing="1" sm="6" md="7" lg="8">
          {menu}
          <Button
            variant='contained'
            color='success'
            sx={{padding: '3px 8px 3px 8px', height: '100px', width: '250px', fontSize: '20px'}}
            onClick={() => {
              fetch(`/strain/add`, {method: 'POST', body: JSON.stringify(
                  {"rod" : 3, "vid" : 5, "author" : "Один фронтендер", "date" : "чт 23.12.2021, 0:46", "annotation" : "отобран по вкусовым качествам кружки паука", "exemplar" : "неповторимый", "modification" : "НЕПОВТОРИМЫЙ Я СКАЗАЛ", "obtainingMethod" : "Ну, попросили - написали", "origin" : "Больная голова", "factParams" : [ { "id" : 1, "name" : "Наличие плазмид", "description" : "описание", "subProps" : [ { "id" : 1, "name" : "", "value" : "Нд" } ] }, { "id" : 2, "name" : "Форма и расположение клеток", "description" : "описание", "subProps" : [ { "id" : 2, "name" : "", "value" : "Короткие тонкие палочки со слабой зернистостью в цепочках " } ] }, { "id" : 4, "name" : "Форма и величина колоний", "description" : "описание", "subProps" : [ { "id" : 5, "name" : "Поверхностные", "value" : "на АГМ: круглые выпуклые серые диам. 1,0-1,5 мм" }, { "id" : 6, "name" : "Глубинные", "value" : "в полужидком АГМ: в форме серовато-белых гречишных зерен величиной 1-3 мм" } ] }, { "id" : 5, "name" : "Аммиак из аргинина", "description" : "описание", "subProps" : [ { "id" : 7, "name" : "", "value" : "Не образует" } ] }, { "id" : 6, "name" : "Утилизация цитрата", "description" : "описание", "subProps" : [ { "id" : 8, "name" : "", "value" : "Утилизирует с образованием газа" } ] }, { "id" : 7, "name" : "Ферментация углеводов", "description" : "описание", "subProps" : [ { "id" : 9, "name" : "Ферментирует", "value" : "лактозу, манит, галактозу" }, { "id" : 10, "name" : "Не ферментирует", "value" : "рамнозу, арабинозу, раффинозу, сахарозу, мальтозу, ксилозу" } ] }, { "id" : 9, "name" : "Характер сгустка", "description" : "описание", "subProps" : [ { "id" : 13, "name" : "", "value" : "Рыхлый" } ] }, { "id" : 10, "name" : "Предельная кислотность", "description" : "описание", "subProps" : [ { "id" : 15, "name" : "", "value" : "132 ºТ" } ] }, { "id" : 11, "name" : "Устойчивость к желчи", "description" : "описание", "subProps" : [ { "id" : 16, "name" : "", "value" : "20% (40% слабо)" } ] }, { "id" : 12, "name" : "Температура роста", "description" : "описание", "subProps" : [ { "id" : 17, "name" : "", "value" : "30 ºС" } ] }, { "id" : 13, "name" : "Антагонизм к кишечной палочке", "description" : "описание", "subProps" : [ { "id" : 18, "name" : "Зона подавления роста", "value" : "Отсутствует" }, { "id" : 19, "name" : "Зона угнетения роста", "value" : "Отсутствует" } ] } ] }
                )}).then(response => {
                  alert('Отправлено');
                })
            }}
          >
            <p>SEND{'\u00A0'}</p><p style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>NUDES</p><p>{'\u00A0'}STAINS</p>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomePage;
