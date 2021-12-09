import React, {useEffect, useReducer, useState} from "react";
import {Paper, Typography, Button, Modal} from '@mui/material';
import DictionaryPage from "./components/DictionaryPage";
import DictionaryTable from "./components/DictionaryTable";
// TODO: Может, есть способ сделать это адекватно?
import {
	OPEN_GENUSES,
	OPEN_PROPERTIES,
	OPEN_MODAL,
	CLOSE_MODAL,
	closeModal
} from "./constants";

const reducer = (state, action) => {
	switch (action.type) {
		case OPEN_MODAL:
			return({...state, targetId: action.payload});
		case CLOSE_MODAL:
			return {...state, targetId: null};
		default:
			return state;
	}
};

const stateInitializer = (initialState) => {
	return {
		targetId: initialState
	}
};

const Dictionaries = () => {
	const [dictionaryName, setDictionaryName] = useState(null);
	const [tableContent, setTableContent] = useState({});
	const [viewTarget, setViewTarget] = useState(null);
	const [childrenArray, setChildrenArray] = useState([]);

	const [state, dispatch] = useReducer(reducer, null, stateInitializer);

	useEffect(() => {
		if (!viewTarget) {
			return;
		}
		let name;
		switch (viewTarget) {
			case OPEN_GENUSES:
				name ='Род';
			break;
			case OPEN_PROPERTIES:
				name ='Свойство';
				break;
			default:
				break;
		}

		fetch(`/${viewTarget}/list`)
			.then(response => response.json())
			.then(dataArray => {
				let newContent = {
					columns: [
						{id: 'name', label: name, minWidth: 200},
						{id: 'childrenCount', label: 'Дочерних элементов', minWidth: 200},
					],
					rows: dataArray,
				}
				setTableContent(newContent);
				setDictionaryName(name)
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewTarget]);

	useEffect(() => {
		if (state.targetId) {
			fetch(`/vid/list/${state.targetId}`)
				.then(response => response.json())
				.then(array => setChildrenArray(array))
		}
	}, [state.targetId]);

	// TODO: Протестировать работу с большим количеством строк, если плохо - виртуализировать
	return(
		<>
			<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
				<Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
				<div style={{display: 'flex',}}>
					<DictionaryPage displayName='Рода' onClick={() => setViewTarget(OPEN_GENUSES)}/>
					<DictionaryPage displayName='Свойства' onClick={() => setViewTarget(OPEN_PROPERTIES)}/>
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
						onClick={() => {
							alert('TODO: добавление элемента')
						}}
					>
						{`Добавить ${dictionaryName}`}
					</Button>
					}
				</div>
				{dictionaryName &&
					<DictionaryTable columns={tableContent.columns} rows={tableContent.rows} dispatch={dispatch} />
				}
			</Paper>
			{/*Явно есть способ сделать модалку лучше, с учётом разности назначений.*/}
			{/*Скорее всего - вынести в компоненты*/}
			{/*Вдобавок тут ещё с children какой-то баг*/}
			<Modal
				open={Boolean(state.targetId)}
				onClose={() => dispatch(closeModal())}
				// TODO: разобраться с центрированием
				sx={{paddingTop: '200px'}}
			>
				{state.targetId &&
					<Paper sx={{width: '600px', maxHeight: '450px', margin: 'auto', padding: '20px'}}>
						<Typography variant='h5'>
							{`Редактирование: ${dictionaryName} - ${tableContent.rows[state.targetId].name}`}
						</Typography>
						{viewTarget === OPEN_PROPERTIES &&
						<>
							<Typography>
								Подсвойства:
							</Typography>
							{childrenArray.map((type, index) =>
								<p key={`type-${index}`}>{`${type.name} - ${type.childrenCount}`}</p>
							)}
						</>
						}
						{viewTarget === OPEN_GENUSES &&
						<>
							<Typography>
								Виды:
							</Typography>
							{childrenArray.map((type, index) =>
								<p key={`type-${index}`}>{`${type.name} - ${type.childrenCount}`}</p>
							)}
						</>
						}
					</Paper>
				}
			</Modal>
		</>
	);
};

export default Dictionaries;
