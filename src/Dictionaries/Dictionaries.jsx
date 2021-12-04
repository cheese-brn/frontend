import React, {useEffect, useReducer, useState} from "react";
import {Paper, Typography, Button,} from '@mui/material';
import DictionaryPage from "./components/DictionaryPage";
import DictionaryTable from "./components/DictionaryTable";
import {OPEN_GENUSES, OPEN_PROPERTIES, OPEN_TYPES} from "./constants";

const reducer = (state, action) => {
	switch (action.type) {
		case OPEN_GENUSES:
			return({viewTarget: OPEN_GENUSES});
		case OPEN_PROPERTIES:
			return({viewTarget: OPEN_PROPERTIES})
		case OPEN_TYPES:
			return({viewTarget: OPEN_TYPES})
	}
};

const stateInitializer = (initialState) => {
	return {
		viewTarget: initialState
	}
};

const Dictionaries = () => {
	const genusList = [
		{name: 'Род1', id: 1, childrenCount: 1,},
		{name: 'Род2', id: 2, childrenCount: 2,},
		{name: 'Род3', id: 3, childrenCount: 3,},
	];
	const typeList = [
		{name: 'Вид1', id: 1, childrenCount: 4,},
		{name: 'Вид2', id: 2, childrenCount: 5,},
		{name: 'Вид2', id: 3, childrenCount: 6,},
	];
	const propsList = [
		{name: 'Свойство1', id: 1, childrenCount: 7,},
		{name: 'Свойство2', id: 2, childrenCount: 8,},
		{name: 'Свойство3', id: 3, childrenCount: 9,},
	];
	const [dictionaryName, setDictionaryName] = useState(null)
	const [tableContent, setTableContent] = useState({});

	const [state, dispatch] = useReducer(reducer, null, stateInitializer);

	useEffect(() => {
		// тут получаем данные с сервера
		if (!state.viewTarget) {
			console.log('нету')
			return;
		}
		console.log('есть')
		let content, name;
		switch (state.viewTarget) {
			case OPEN_GENUSES:
				name ='Род';
				content = genusList;
				break;
			case OPEN_PROPERTIES:
				name ='Свойства';
				content = propsList;
				break;
			case OPEN_TYPES:
				name ='Вид';
				content = typeList;
				break;
			default:
				break;
		}
		tableContent.columns = [
			{id: 'name', label: name, minWidth: 200},
			{id: 'childrenCount', label: 'Дочерних элементов', minWidth: 200},
		];
		tableContent.rows = content;
		setTableContent(tableContent);
		setDictionaryName(name)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.viewTarget]);
	// TODO: Протестировать работу с большим количеством строк, если плохо - виртуализировать
	return(
		<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
			<Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
			<div style={{display: 'flex',}}>
				<DictionaryPage displayName='Рода' onClick={() => dispatch({type: OPEN_GENUSES})}/>
				<DictionaryPage displayName='Виды' onClick={() => dispatch({type: OPEN_TYPES})}/>
				<DictionaryPage displayName='Свойства' onClick={() => dispatch({type: OPEN_PROPERTIES})}/>
			</div>
			<Typography variant='h6' component='div' align='left'>
				Для редактирования элемента нажмите на него в таблице
			</Typography>
			{dictionaryName &&
			<Button
				variant='contained'
				color='success'
			>
				{`Добавить ${dictionaryName}`}
			</Button>
			}
			{dictionaryName &&
				<DictionaryTable columns={tableContent.columns} rows={tableContent.rows}/>
			}
		</Paper>
	);
}

export default Dictionaries;