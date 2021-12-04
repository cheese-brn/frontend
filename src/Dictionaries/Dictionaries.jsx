import React, {useEffect, useState} from "react";
import {Paper, Grid} from '@mui/material';
import DictionaryElement from "./components/DictionaryElement";

const Dictionaries = () => {
	const genusList = [
		{name: 'Род1', id: 1, childrenCount: 1,},
		{name: 'Род2', id: 2, childrenCount: 2,},
		{name: 'Род3', id: 3, childrenCount: 3,},
	];
	const typeList = [
		{name: 'Вид1', id: 1, childrenCount: 1,},
		{name: 'Вид2', id: 2, childrenCount: 2,},
		{name: 'Вид2', id: 3, childrenCount: 3,},
	];
	const [elements, setElements] = useState([]);
	useEffect(() => {
		setElements(genusList.map((genus, index) => <DictionaryElement element={genus} key={index}/> ));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return(
		<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
			{elements}
			Словарники
		</Paper>
	);
}

export default Dictionaries;