import React from 'react';
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import PropTypes from 'prop-types';

// TODO: разобраться с PropTypes
const DictionaryElement = (props) => {
	// eslint-disable-next-line react/prop-types
	let { name, id, childrenCount } = props.element;

	const elementStyle = {
		width: '250px',
		height: '60px',
		margin: '20px',
		padding: '0 20px 0 20px',
		borderRadius: '5px',
		backgroundColor: '#26A69A',
		color: '#FFFFFF',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	};

	return(
		<Card
			sx={elementStyle}>
			<Typography variant='h5' component='div' align='left'>
				{name}
			</Typography>
			<Typography variant='h5' component='div' align='left'>
				{childrenCount}
			</Typography>
		</Card>
	);
};

DictionaryElement.propTypes = {
	props: PropTypes.object,
	name: PropTypes.string,
	id: PropTypes.number,
	childrenCount: PropTypes.number,
}

export default DictionaryElement;