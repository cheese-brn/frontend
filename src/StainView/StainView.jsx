import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import {Paper, Typography, Grid, TextField, Divider, Stack, Button} from "@mui/material";

const StainView = () => {
	const data = useParams();
	const [model, setModel] = useState({});
	const modelCopy = useRef(null);
	const [isReadOnly, setIsReadOnly] = useState(true);
	const [basicProps, setBasicProps] = useState([]);

	useEffect(() => {
		let stainData;
		switch (data.stainID) {
			case '0':
				stainData = {
					id: 0,
					genus: 'Лактококус',
					type: 'Лактис',
					name: '977',
					modification: 'С15',
					obtainingMethod: 'Культивирование в отсутствии лактозы (Я.Р. Каган, И.Я. Сергеева)',
					origin: 'Лактозоотрицательынй мутант штамма L. lactis 9772',
					annotation: 'Может использоваться в исследованиях в качестве индикаторного штамма с селективным маркером\n\n\nasdadasdd',
					lastEdit: 'Вчера, 20:00',
					author: 'Иванов Иван Иванович',
					actualProps: [
						{
							name: 'Наличие плазмид',
							description: 'Ну есть плазмиды и есть. Или нету',
							subProps: [
								{
									name: '',
									value:['НД',]
								}],
						},
						{
							name: 'Маркеры',
							description: 'Для доски',
							subProps: [
								{
									name: '',
									value:['Лизогенный; Lac Str',]
								},
							],
						},
						{
							name: 'Фаготип',
							description: 'Тип фагов',
							subProps: [
								{
									name: '',
									value:[
										'Какие-то символы, кодировкой сделаем как надо',
										'Но их будет много раз',
										'так что храним в массиве',
									]
								},
							],
						},
							{
								name: 'Форма и расположение клеток',
								description: 'Клеточная форма и расположение',
								subProps: [
									{
										name: '',
										value: [
											'Кокки',
											'Диплококки',
										]
									}
								],
							},
							{
								name: 'Форма и величина колоний',
								description: 'Колониальная форма и величина',
								subProps: [
									{
										name: 'Поверхностные',
										value: 'Круглые каплевидные бла-бла-бла',
									},
									{
										name: 'Глубинные',
										value: 'дискообразные',
									}
								],
							},
						],
						 // functionalProps: [
						 // 	{
						 // 		name: 'Кислотообразование в молоке',
						 // 		description: 'Образование кислоты в среде молока',
						 // 		subProps: [
						 // 			{
						 // 				name: 'С глюкозой',
						 // 				value:
						 // 			},
						 // 			{
						 // 				name: 'Без глюкозы',
						 // 				value:
						 // 			}
						 // 		],
						 // 	}
						 // ],
					};
				break;
			default:
				return null;
		}
		setModel(stainData);
		modelCopy.current = stainData;
		}, [data.stainID]);

	useEffect(() => {
		let props = model?.actualProps?.map((prop, key) => {
			return(<p key={`basic-prop-${key}`}>туст</p>)
		});
		setBasicProps(props);
	}, [model?.actualProps]);

	// TODO: Сделать нормально
	const costilStyle = {
		marginBottom: '14px'
	};

	const handleChangeGeneric = (event) => {
			setModel({...model, [event.target.name]: event.target.value})
	}

	// TODO: fix 'A component is changing an uncontrolled input to be controlled' issue
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
								name='genus'
								inputProps={{readOnly: isReadOnly}}
								value={model?.genus}
								onChange={ handleChangeGeneric }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__type-field'
								label='Вид'
								name='type'
								inputProps={{readOnly: isReadOnly}}
								value={model?.type}
								onChange={ handleChangeGeneric }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__name-field'
								label='Наименование'
								name='name'
								inputProps={{readOnly: isReadOnly}}
								value={model?.name}
								onChange={ handleChangeGeneric }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__modification-field'
								label='Модификация'
								name='modification'
								inputProps={{readOnly: isReadOnly}}
								value={model?.modification}
								onChange={ handleChangeGeneric }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__obtaining-method-field'
								label='Способ получения'
								name='obtainingMethod'
								inputProps={{readOnly: isReadOnly}}
								value={model?.obtainingMethod}
								onChange={ handleChangeGeneric }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__origin-field'
								label='Происхождение'
								name='origin'
								multiline
								inputProps={{readOnly: isReadOnly}}
								value={model?.origin}
								onChange={ handleChangeGeneric }
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__annotation-field'
								label='Аннотация'
								name='annotation'
								multiline
								inputProps={{readOnly: isReadOnly}}
								value={model?.annotation}
								onChange={ handleChangeGeneric }
							/>
							{basicProps}
						</Stack>
					</Grid>
					<Divider orientation="vertical" flexItem/>
					<Grid item sx={{textAlign: 'left', marginLeft: '15px'}}>
						<Stack>
							<Typography variant='h6'>
								{`Последнее редактирование:`}
							</Typography>
							<Typography>
								{`${model.author}, ${model.lastEdit}`}
							</Typography>
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
										console.log(model)
										console.log(modelCopy.current)
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