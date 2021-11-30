import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {Paper, Typography, Grid, TextField} from "@mui/material";

// For debug purposes
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const StainView = () => {
	const data = useParams();
	const [model, setModel] = useState({});
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		// sleep(5000);
		let stainData;
		switch (data.stainID) {
			case '0':
				stainData = {
					genus: 'Лактококус',
					type: 'Лактис',
					name: '977',
					modification: 'С15',
					obtainingMethod: 'Культивирование в отсутствии лактозы (Я.Р. Каган, И.Я. Сергеева)',
					origin: 'Лактозоотрицательынй мутант штамма L. lactis 9772',
					annotation: 'Может использоваться в исследованиях в качестве индикаторного штамма с селективным маркером',
					lastEdit: 'Вчера, 20:00',
					author: 'Иванов Иван Иванович',
					id: 0,
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
		}
		setModel(stainData);
		}, [data.stainID])


// TODO: fix 'A component is changing an uncontrolled input to be controlled' issue
	return(
			<Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
				<Typography variant='h4'>
					Паспорт штамма
				</Typography>
				<TextField id='stain-view__genus-field' label='Род' inputProps={{readOnly: true}} value={model?.genus}/>
				<TextField id='stain-view__type-field' label='Вид' inputProps={{readOnly: true}} value={model?.type}/>
				<TextField id='stain-view__name-field' label='Наименование' inputProps={{readOnly: true}} value={model?.name}/>
				<TextField id='stain-view__modification-field' label='Модификация' inputProps={{readOnly: true}} value={model?.modification}/>
				{data.stainID}
			</Paper>
	);
}

export default StainView;