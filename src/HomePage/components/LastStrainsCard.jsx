import React, {useMemo} from 'react';
import {Card, CardContent, Typography, List, ListItemButton, Divider,} from "@mui/material";
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";

const lastStrainsCard = ({strainsArray}) => {
	// Чё это было вообще
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const lastStrains = useMemo(() => {
		return strainsArray.map((stain, index) =>
			<>
			<Link to={`/strain/${stain.id}`} style={{color: 'black', textDecoration: 'none'}} key={`stain-${index}`}>
				<ListItemButton >
					<div style={{width: 'inherit'}}>
						<Typography variant='h6'>
							{stain.stainName}
						</Typography>
						<Typography variant='subtitle1'>
							{`${stain.author} - ${stain.lastEdit}`}
						</Typography>
					</div>
				</ListItemButton>
			</Link>
			<Divider/>
		</>
		);
	}, [strainsArray]);

	return(
		<Card sx={{ width: '360px', height: '500px', margin: '20px', borderRadius: '5px', padding: '0'}}>
			<div style={{backgroundColor: '#26A69A', color: '#FFFFFF', height: '80px', padding: '10px 0 0 15px'}}>
				<Typography variant='h5' component='div' align='left'>
					Редактирование последних паспортов
				</Typography>
			</div>
			<CardContent>
				<List sx={{padding: '0', overflowY:'auto'}}>
					{lastStrains}
				</List>
			</CardContent>
		</Card>
	);
}

lastStrainsCard.propTypes = {
	strainsArray: PropTypes.array,
}

export default lastStrainsCard;