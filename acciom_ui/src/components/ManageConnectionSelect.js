import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

import { manageConnectionsCaseUpdate } from '../actions/testSuiteListActions';

const BootstrapInput = withStyles(theme => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(1),
		},
	},
	input: {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ced4da',
		fontSize: 16,
		padding: '10px 26px 10px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:focus': {
			borderRadius: 4,
			borderColor: '#80bdff',
			boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
		},
	},
}))(InputBase);

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	margin: {
		margin: theme.spacing(1),
	},
	MuiSelect: {minWidth:'160px'},
}));


function ManageConnectionSelect(props) {
	const classes = useStyles();

	const renderTestCases = (allCases) => {
		if (allCases) {
			return allCases.map(testCase => (
				<div key={testCase.case_id} className="manageconnectionTestCase">
					<label className="form-check-label">
						<input
							type="checkbox"
							value={testCase.case_id}
							name={testCase.case_name}
							onChange={(e) => props.onCaseSelectionChange(e.target)}
						/>
					</label> {testCase.case_name}
				</div>
			));
		}
	    return null;
	};
	return (
		<form className={classes.root} autoComplete="off">
			<Table className="manageSelectConnection">
				<tbody>
					<tr className="	">
						<td className="manageConnectionLabel changeconnpanelheadborder">
							<label className="manageConnectionHeading sub_title selectcaselabel">Select Connection</label>
						</td>
						<td className="changeconnpanelheadborder">
							<select className="form-control selecteditbox"
								value={props.selectedConnection}
								onChange={props.onConnectionChange}
								name="selectConnection"
							>
								<option value="" disabled>Select Connection</option>
								{ props.allConnections.map(connection => (
									connection ?
										<option key={connection.db_connection_id} value={connection.db_connection_id}>{connection.db_connection_name}</option> : null
								))
								}
							</select>
						</td>
					</tr> 
					<tr>
						<td className="manageConnectionLabel">
							<label className="manageConnectionHeading sub_title selectcaselabel2">Select Cases</label>
						</td>
						<td className="manageConnectionLabel">
							{
							    renderTestCases(props.allCases[props.testSuiteId])
							}
						</td>
					</tr>
				</tbody>
			</Table>
		</form>
	);
}

const mapStateToProps = (state) => {
	return {
		allConnections : state.testSuites.connectionsList && 
			state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
		allCases : state.testSuites.connectionsList && 
			state.testSuites.connectionsList.allCases? state.testSuites.connectionsList.allCases : []
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onManageConnectionsCaseUpdate: data => dispatch(manageConnectionsCaseUpdate(data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageConnectionSelect);