import React, {useEffect, useReducer, useState} from "react";
import {Paper, Typography, Button, Modal} from '@mui/material';
import DictionaryPage from "./components/DictionaryPage";
import DictionaryTable from "./components/DictionaryTable";
// TODO: Может, есть способ сделать это адекватно?
import {
	OPEN_GENUSES,
	OPEN_PROPERTIES,
	OPEN_TYPES,
	OPEN_MODAL,
	CLOSE_MODAL,
	CHANGE_PAGE,
	changePage,
	closeModal
} from "./constants";

const reducer = (state, action) => {
	switch (action.type) {
		case CHANGE_PAGE:
			return ({...state, viewTarget: action.payload});
		case OPEN_MODAL:
			return({...state, targetId: action.payload});
		case CLOSE_MODAL:
			console.log('да закройся ааааа')
			return {...state, targetId: null};
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
			return;
		}
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
		<>
			<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
				<Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
				<div style={{display: 'flex',}}>
					<DictionaryPage displayName='Рода' onClick={() => dispatch(changePage(OPEN_GENUSES))}/>
					<DictionaryPage displayName='Виды' onClick={() => dispatch(changePage(OPEN_TYPES))}/>
					<DictionaryPage displayName='Свойства' onClick={() => dispatch(changePage(OPEN_PROPERTIES))}/>
				</div>
				<div style={{display: 'flex',}}>
					<Typography variant='h6' component='div' align='left'>
						Для редактирования элемента нажмите на него в таблице
					</Typography>
					{dictionaryName &&
					<Button
						variant='contained'
						color='success'
						sx={{marginLeft: '20px'}}
					>
						{`Добавить ${dictionaryName}`}
					</Button>
					}
				</div>
				{dictionaryName &&
					<DictionaryTable columns={tableContent.columns} rows={tableContent.rows} dispatch={dispatch} />
				}
			</Paper>
			<Modal
				open={Boolean(state.targetId)}
				onClose={() => dispatch(closeModal())}
			>
				<Paper sx={{width: '200px', height: '200px'}}>
					модалОЧКА
				</Paper>
			</Modal>
		</>
	);
}

export default Dictionaries;