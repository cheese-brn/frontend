import React, {useMemo} from 'react';
import {Card, CardContent, Typography, List, ListItem, Divider} from "@mui/material";
import PropTypes from "prop-types";

const LastStainsCard = ({stainsArray}) => {
	console.log('last stains rendered')
	const lastStains = useMemo(() => {
		return stainsArray.map((stain, key) =>
		<ListItem key={`stain-${key}`}>
			<div style={{width: 'inherit'}}>
				<Typography variant='h6'>
					{stain.stainName}
				</Typography>
				<Typography variant='subtitle1'>
					{stain.lastEdit}
				</Typography>
				<Divider/>
			</div>
		</ListItem>);
	}, [stainsArray]);

	return(
		<Card sx={{ width: '420px', margin: '20px', borderRadius: '5px', padding: '0'}}>
			<div style={{backgroundColor: '#26A69A', color: '#FFFFFF', height: '80px', padding: '10px 0 0 15px'}}>
				<Typography variant='h5' component='div' align='left'>
					Редактирование последних паспортов
				</Typography>
			</div>
			<CardContent>
				<List sx={{padding: '0'}}>
					{lastStains}
				</List>
			</CardContent>
		</Card>
	);
}

LastStainsCard.propTypes = {
	stainsArray: PropTypes.array,
}

export default LastStainsCard;