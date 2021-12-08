/* eslint-disable react/prop-types */
import React, {useState} from "react";
import {Typography, Button, Divider, TextField} from "@mui/material";

// TODO: разобраться с PropTypes
const SimplePropertyInput = props => {
	const { prop, readOnly, propKey} = props;
	const {name, subProps, description, handleSubPropChange} = prop;

	const smallButtonStyle = {
		padding: '0 4px 0 4px',
		minWidth: '30px',
		minHeight: '30px',
		marginLeft: '5px'
	}
	return(
		<div style={{border: '1px solid grey', borderRadius: '5px', alignItems: 'left', marginBottom: '15px', padding: '10px'}}>
			<div style={{ display: 'flex',}}>
				<Typography variant='p' sx={{fontSize: '18px'}}>{name}</Typography>
				{!readOnly && <Button variant='contained' color='success' sx={smallButtonStyle}>+</Button>}
				{!readOnly && <Button variant='contained' color='error' sx={smallButtonStyle}>-</Button>}
			</div>
			{subProps.map((subProp, key)=>
				<div key={`prop-${propKey}-subprop-${key}`} style={{textAlign: 'left', display: 'flex', flexDirection: 'column'}}>
						{readOnly && <Typography variant={'p'}>{`${subProp.name ? `${subProp.name}: ` : ``}${subProp.value}`}</Typography>}
						{!readOnly &&
						<>
							{subProp.name && <Typography variant={'p'}>{subProp.name}</Typography>}
							<TextField/>
						</>
						}
						<Divider/>
					<Divider/>
				</div>
			)}
		</div>
	);
};

export default SimplePropertyInput;