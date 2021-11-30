import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {Paper, Typography, Grid, TextField, Divider, Stack, Button} from "@mui/material";

// For debug purposes
// function sleep(ms) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }

const StainView = () => {
	const data = useParams();
	const [model, setModel] = useState({});
	const [isReadOnly, setIsReadOnly] = useState(true);

	//const [actualProps, setActualProps] = useState([]);
	useEffect(() => {
		// sleep(5000);
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
		}, [data.stainID])
	// TODO: Сделать нормально
	const costilStyle = {
		marginBottom: '14px'
	};

// TODO: fix 'A component is changing an uncontrolled input to be controlled' issue
	return(
			<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
				<Grid container spacing='5'>
					<Grid container sm='6' md='7' lg='8' sx={{paddingRight: '15px'}}>
						<Stack orientation='vertical' width={'100%'}>
							<Typography variant='h4'>
								Паспорт штамма
							</Typography>
							<TextField
								sx={costilStyle}
								id='stain-view__genus-field'
								label='Род'
								inputProps={{readOnly: isReadOnly}}
								value={model?.genus}
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__test-field'
								label='тест'

								onChange={ event => {
									let modelCopy = model;
									modelCopy.genus = event.target.value;
									console.log(event.target.value);
									setModel(modelCopy)
								}}
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__type-field'
								label='Вид'
								inputProps={{readOnly: isReadOnly}}
								value={model?.type}
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__name-field'
								label='Наименование'
								inputProps={{readOnly: isReadOnly}}
								value={model?.name}
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__modification-field'
								label='Модификация'
								inputProps={{readOnly: isReadOnly}}
								value={model?.modification}
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__obtaining-method-field'
								label='Способ получения'
								inputProps={{readOnly: isReadOnly}}
								value={model?.obtainingMethod}
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__origin-field'
								label='Происхождение'
								multiline
								inputProps={{readOnly: isReadOnly}}
								value={model?.origin}
							/>
							<TextField
								sx={costilStyle}
								id='stain-view__annotation-field'
								label='Аннотация'
								multiline
								inputProps={{readOnly: isReadOnly}}
								value={model?.annotation}
							/>
						</Stack>
						{}
					</Grid>
					<Divider orientation="vertical" flexItem/>
					<Grid item sx={{textAlign: 'left', marginLeft: '15px'}}>
						<Typography variant='h6'>
							{`Последнее редактирование:`}
						</Typography>
						<Typography>
							{`${model.author}, ${model.lastEdit}`}
						</Typography>
						{isReadOnly && <Button
							variant='contained'
							onClick={() => {
								setIsReadOnly(false);
							}}
						>
							Редактировать
						</Button>
						}
						{!isReadOnly && <>
							
						</>}
					</Grid>
				</Grid>
			</Paper>
	);
}

export default StainView;