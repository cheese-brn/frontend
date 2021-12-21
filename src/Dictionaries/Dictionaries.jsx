import React, {useEffect, useReducer, useState} from "react";
import {Paper, Typography, Button, Modal, Divider, TextField} from '@mui/material';
import DictionaryPage from "./components/DictionaryPage";
import DictionaryRow from "./components/DictionaryRow";
import PropertyEditModal from "./components/PropertyEditModal";

// TODO: Может, есть способ сделать это адекватно?
import {
	OPEN_GENUSES,
	OPEN_PROPERTIES,
	OPEN_TYPES,
	CLOSE_ITEM,
	SET_DATA,
	EDIT_ITEM,
	DELETE_ITEM,
	closeItem,
	setData
} from "./constants";

const reducer = (state, action) => {
	switch (action.type) {
		case EDIT_ITEM:
			return({...state, itemId: action.payload});
		case CLOSE_ITEM:
			return {...state, itemId: null};
		case SET_DATA:
			return {...state, rows: action.payload};
		case DELETE_ITEM:
			alert('удаление');
			return state
		default:
			return state;
	}
};

const stateInitializer = (initialState) => {
	return {
		itemId: initialState,
		rows: initialState,
	}
};

const Dictionaries = () => {
	const [dictionaryName, setDictionaryName] = useState(null);
	const [dictionaryTarget, setDictionaryTarget] = useState(null);
	const [childrenArray, setChildrenArray] = useState([]);

	const [state, dispatch] = useReducer(reducer, null, stateInitializer);

	useEffect(() => {
		if (!dictionaryTarget) {
			return;
		}

		let name;
		switch (dictionaryTarget) {
			case OPEN_GENUSES:
				name ='Род';
			break;
			case OPEN_PROPERTIES:
				name ='Свойство';
				break;
			case OPEN_TYPES:
				name = 'Вид';
				break;
			default:
				break;
		}

		fetch(`/${dictionaryTarget}`)
			.then(response => response.json())
			.then(dataArray => {
				dispatch(setData(dataArray));
				setDictionaryName(name);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dictionaryTarget]);

	useEffect(() => {
		if (state.itemId) {
			let path;
			switch(dictionaryTarget) {
				case OPEN_GENUSES:
					path = '/vids/rods';
					break;
				case OPEN_TYPES:
					path = '/strains/vids';
					break;
				case OPEN_PROPERTIES:
					path = '/subproperties/properties';
			}

			fetch(`${path}/${state.itemId}`)
				.then(response => response.json())
				.then(array => {
					return setChildrenArray(array)
				})
		}
	}, [state.itemId]);

	// TODO: Протестировать работу с большим количеством строк, если плохо - виртуализировать
	return(
		<>
			<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
				<Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
				<div style={{display: 'flex',}}>
					<DictionaryPage displayName='Роды' onClick={() => setDictionaryTarget(OPEN_GENUSES)}/>
					<DictionaryPage displayName='Виды' onClick={() => setDictionaryTarget(OPEN_TYPES)}/>
					<DictionaryPage displayName='Свойства' onClick={() => setDictionaryTarget(OPEN_PROPERTIES)}/>
				</div>
				{dictionaryName &&
					<div style={{width: '70%'}}>
						{state.rows?.map((row, index) =>
							<div key={`dictionary-row-${index}`}>
								<DictionaryRow data={row} dispatch={dispatch}/>
								<Divider/>
							</div>
						)}
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
					</div>
				}
			</Paper>
			{/*Явно есть способ сделать модалку лучше, с учётом разности назначений.*/}
			{/*Скорее всего - вынести в компоненты*/}
			{/*TODO: доработать пустые подсвойства*/}
			<Modal
				open={Boolean(state.itemId)}
				onClose={() => dispatch(closeItem())}
				// TODO: разобраться с центрированием
				sx={{paddingTop: '200px'}}
			>
				{state.itemId &&
					<Paper sx={{width: '600px', maxHeight: '450px', margin: 'auto', padding: '20px'}}>
						<Typography variant='h5'>
							{`Редактирование: ${dictionaryName} - ${state.rows[state.itemId - 1].name}`}
						</Typography>

						{dictionaryTarget === OPEN_PROPERTIES &&
						<>
							<Typography>
								Подсвойства:
							</Typography>
							{childrenArray.map((subProp, index) =>
								<p key={`type-${index}`}>{`${subProp.name}`}</p>
							)}
						</>
						}

						{dictionaryTarget === OPEN_GENUSES &&
						<>
							<Typography>
								Виды:
							</Typography>
							{childrenArray.map((type, index) =>
								<p key={`type-${index}`}>{`${type.name}`}</p>
							)}
						</>
						}

						{dictionaryTarget === OPEN_TYPES &&
						<>
							<Typography>
								Штаммы:
							</Typography>
							{childrenArray.map((type, index) =>
								<p key={`type-${index}`}>{`${type.name}`}</p>
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