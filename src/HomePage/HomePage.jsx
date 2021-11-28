import React, {useEffect, useState} from "react";
import menuCardsContents from "./constants";
import MenuRouteCard from "./components/MenuRouteCard";
import LastStainsCard from "./components/LastStainsCard";
import {Paper} from '@mui/material';

const HomePage = () => {

	const [menu, setMenu] = useState(null);
	// Это нужно получить с сервера
	const lastStains = [{stainName: 'Штамм1', lastEdit: 'Вчера, 20:00'},
											{stainName: 'Штамм2', lastEdit: '15 ноября, 20:00'},
											{stainName: 'Штамм3', lastEdit: '10 сентября, 20:00'}];

	useEffect(() => {
		let res = [];
		Object.keys(menuCardsContents).forEach(card => {
			res.push(
				<MenuRouteCard
					id={`home-page__${menuCardsContents[card].id}-card`}
					key={menuCardsContents[card].id}
					cardTitle={menuCardsContents[card].title}
					cardIconPath={menuCardsContents[card].logo}
				/>)
		});
		setMenu(res)
	}, []);

	return(
		<>
			<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
				<LastStainsCard stainsArray={lastStains}/>
				{menu}
			</Paper>
		</>
	);
};

export default HomePage;