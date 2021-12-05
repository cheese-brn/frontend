/* eslint-disable react/prop-types */
import React, {useState} from "react";
import {Typography, Button, Divider, TextField} from "@mui/material";

// TODO: разобраться с PropTypes
const SimplePropertyInput = props => {
	const { prop, readOnly, propKey} = props;
	const {name, subProps, description, handleSubPropChange} = prop;

	const costilStyle = {
		marginBottom: '14px'
	};
	// TODO: редактирование подсвойства
	return(
		<div style={{border: '1px solid grey', borderRadius: '5px', alignItems: 'left', marginBottom: '15px', padding: '10px'}}>
			<div style={{ display: 'flex',}}>
				<Typography variant='p' sx={{fontSize: '18px'}}>{name}</Typography>
				{!readOnly && <Button variant='contained' color='success'>+</Button>}
				{!readOnly &&	<Button variant='contained' color='error' >-</Button>}
			</div>
			{subProps.map((subProp, key)=>
				<div key={`prop-${propKey}-subprop-${key}`} style={{textAlign: 'left'}}>
					{readOnly && <Typography variant={'p'}>{`${subProp.name ? `${subProp.name}: ` : ``}${subProp.value}`}</Typography>}
					<Divider/>
				</div>
			)}
		</div>
	);
}

export default SimplePropertyInput;