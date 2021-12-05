import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import {Paper, Typography, Grid, TextField, Divider, Stack, Button} from "@mui/material";
import SimplePropertyInput from "./components/SimplePropertyInput";

const StainView = () => {
	const {stainID} = useParams();
	const [model, setModel] = useState({
					"id":0,
					"rod":"",
					"vid":"",
					"annotation":"",
					"exemplar":"",
					"modification":"",
					"obtainingMethod":"",
					"origin":"",
					"factParams":[],
	});
	const modelCopy = useRef(null);
	const [isReadOnly, setIsReadOnly] = useState(true);
	const [basicProps, setBasicProps] = useState([]);

	useEffect(() => {
		// switch (stainID) {
		// 	case '0':
		// 		stainData = {
		// 			"id":1,
		// 			"rod":"Lactococcus",
		// 			"vid":"lactis",
		// 			"annotation":"Может использоваться в исследованиях в качестве индикаторного штамма с селективным маркером",
		// 			"exemplar":"977",
		// 			"modification":"C15",
		// 			"obtainingMethod":"Культивирование в отсутствии лактозы (Я.Р.Каган, И.Я.Сергеева)",
		// 			"origin":"Лактозоотрицательный мутант штамма L. lactis 977.2",
		// 			"factParams":[
		// 				{
		// 					"name":"Наличие плазмид",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Наличие плазмид",
		// 							"value":"Нд"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"name":"Форма и расположение клеток",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Форма и расположение клеток",
		// 							"value":"Кокки, диплококки"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"name":"Форма и величина колоний",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Поверхностные",
		// 							"value":"Круглые каплевидные с ровным краем диам. 2 мм"
		// 						},
		// 						{
		// 							"name":"Глубинные",
		// 							"value":"дискообразные"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"name":"Аммиак из аргинина",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Аммиак из аргинина",
		// 							"value":"Образует"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"name":"Утилизация цитрата",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Утилизация цитрата",
		// 							"value":"Не утилизирует"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"name":"Ферментация углеводов",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Ферментирует",
		// 							"value":"глюкозу, галактозу, мальтозу, манит (слабо)"
		// 						},
		// 						{
		// 							"name":"Не ферментирует",
		// 							"value":"лактозу, сахарозу"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"name":"Характер сгустка",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Характер сгустка",
		// 							"value":"-"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"name":"Температура роста",
		// 					"description":"описание",
		// 					"subProps":[
		// 						{
		// 							"name":"Температура роста",
		// 							"value":"Нд"
		// 						}
		// 					]
		// 				}
		// 			]
		// 		};
		// 		break;
		// 	default:
		// 		return null;
		// }
		fetch('/strain/10').then(response => response.json()).then(res => {console.log(res); setModel(res)})
		modelCopy.current = model;
		}, [stainID]);

	useEffect(() => {
		let props = model?.factParams?.map((prop, key) => {
			return(<SimplePropertyInput
				prop={prop}
				propKey={key}
				readOnly={isReadOnly}
				key={`basic-prop-${key}`}
				onChange={handleSubPropChange}
			/>);
		});
		setBasicProps(props);
	}, [model?.factParams, isReadOnly]);

	// TODO: Сделать нормально
	const costilStyle = {
		marginBottom: '14px'
	};

	const handleGenericChange = (event) => {
			setModel({...model, [event.target.name]: event.target.value})
	}
	const handleSubPropChange = (propKey, subPropKey, newValue) => {
		const {actualProps} = model;
		// TODO: изменение свойств

		setModel({...model, actualProps});
	}

	// TODO: Разобраться с цветовой палитрой
	return(
			<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
				<Grid container spacing='5'>
					<Grid container sm='6' md='7' lg='8' sx={{paddingRight: '15px', paddingLeft:'20px', }}>
						<Stack orientation='vertical' width={'100%'}>
							<Typography variant='h4'>
								Паспорт штамма
							</Typography>
							<TextField
								sx={costilStyle}
								id='stain-view__genus-field'
								label='Род'
								name='rod'
								inputProps={{readOnly: isReadOnly}}
								value={model?.rod}
								onChange={ handleGenericChange }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__type-field'
								label='Вид'
								name='vid'
								inputProps={{readOnly: isReadOnly}}
								value={model?.vid}
								onChange={ handleGenericChange }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__name-field'
								label='Наименование'
								name='exemplar'
								inputProps={{readOnly: isReadOnly}}
								value={model?.exemplar}
								onChange={ handleGenericChange }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__modification-field'
								label='Модификация'
								name='modification'
								inputProps={{readOnly: isReadOnly}}
								value={model?.modification}
								onChange={ handleGenericChange }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__obtaining-method-field'
								label='Способ получения'
								name='obtainingMethod'
								inputProps={{readOnly: isReadOnly}}
								value={model?.obtainingMethod}
								onChange={ handleGenericChange }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__origin-field'
								label='Происхождение'
								name='origin'
								multiline
								inputProps={{readOnly: isReadOnly}}
								value={model?.origin}
								onChange={ handleGenericChange }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__annotation-field'
								label='Аннотация'
								name='annotation'
								multiline
								inputProps={{readOnly: isReadOnly}}
								value={model?.annotation}
								onChange={ handleGenericChange }
							/>
							<Typography variant='h5' align='left'>
								Свойства штамма
							</Typography>
							{basicProps}
						</Stack>
					</Grid>
					<Divider orientation="vertical" flexItem/>
					<Grid item sx={{textAlign: 'left', marginLeft: '15px'}}>
						<Stack>
							<Typography variant='h6'>
								{`Последнее редактирование:`}
							</Typography>
							{/*<Typography>*/}
							{/*	{`${model.author}, ${model.lastEdit}`}*/}
							{/*</Typography>*/}
							{isReadOnly &&
							<Button
								variant='contained'
								onClick={() => {
									setIsReadOnly(false);
								}}
							>
								Редактировать
							</Button>
							}
							{!isReadOnly && <>
								<Button
									variant='contained'
									color='success'
									sx={{marginTop: '20px'}}
									onClick={() => {
										setIsReadOnly(true);
										// TODO: отправка модели на бэк

									}}>
									Сохранить изменения
								</Button>
								<Button
									variant='contained'
									color='warning'
									sx={{marginTop: '20px'}}
									onClick={() => {
										setIsReadOnly(true);
										setModel({...modelCopy.current});
									}}>
									Отменить изменения
								</Button>
							</>}
							<Button
								variant='outlined'
								color='error'
								sx={{marginTop: '20px'}}
							>
								Удалить штамм
							</Button>
						</Stack>

					</Grid>
				</Grid>
			</Paper>
	);
}

export default StainView;