/* eslint-disable react/prop-types */
import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';

const DictionaryTable = props => {
	const {columns, rows} = props;
	return(
		<TableContainer>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						{columns.map(column =>
							<TableCell key={column.id} style={{minWidth: column.minWidth}}>
								{column.label}
							</TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row =>
						<TableRow hover role='button' key={row.id}>
							<TableCell>
								{row.name}
							</TableCell>
							<TableCell>
								{row.childrenCount}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default DictionaryTable;