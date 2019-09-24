import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Table, FormGroup, FormControl} from 'react-bootstrap';

import { 
	hideTestCaseDialog, 
	showTestCaseEditEnabled, 
	showTestCaseViewEnabled, 
	updateTestCase
} from '../actions/testSuiteListActions';

const styles = theme => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
		width: '600px',
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
		},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
	},
	selectWidth: {width: 156},
});

class TestCaseDetails extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			formData: {}, // Contains login form data
			errors: {}, // Contains login field errors
			formSubmitted: false, // Indicates submit status of login form 
			loading: false // Indicates in progress state of login form
		};
	}

	handleInputChange = ({target}) => {
		const { value, name } = target;

		const { formData } = this.state;
		formData[name] = value;

		this.setState({
			formData
		});
	}

	handleCaseDialogBoxClose = () => {
		this.props.hideTestCaseDialog();
		this.props.showTestCaseViewEnabled();
	};

	handleTestCaseEditMode = () => {
		this.props.showTestCaseEditEnabled();
		
	};

	handleTestCaseViewMode = () => {
		this.props.showTestCaseViewEnabled();
	
	};

	getSnapshotBeforeUpdate = (prevProps, prevState) => {
		if (!prevProps.viewTestCase.showTestCaseDialog && this.props.viewTestCase.showTestCaseDialog) {
			this.setState({
				...this.state,
				formData: {
					...this.state.formData,
					testCaseId: this.props.viewTestCase.test_case_id,

					// check the below 2 props
					sourceConnection: this.props.viewTestCase.src_db_id,
					targetConnection: this.props.viewTestCase.target_db_id,

					sourceTable: this.props.viewTestCase.src_table,
					targetTable: this.props.viewTestCase.target_table,
					column: this.props.viewTestCase.column,
					sourceQuery: this.props.viewTestCase.sourceqry,
					targetQuery: this.props.viewTestCase.targetqry
				}
			})
			return this.props.viewTestCase.showTestCaseDialog;
		}
		return null;
	}

	renderConnectionsOptions = () => {
		return this.props.allConnections.map(connection => (
			connection ?
				<option key={connection.db_connection_id} value={connection.db_connection_id}>{connection.db_connection_name}</option> : null
		));
	}

	handleTestCaseUpdate = () => {
		const payload = {
			test_case_id: this.state.formData.testCaseId,
			src_table: this.state.formData.sourceTable,
			target_table: this.state.formData.targetTable,
			src_db_id: this.state.formData.sourceConnection,
			target_db_id: this.state.formData.targetConnection,
			src_qry: this.state.formData.sourceQuery,
			target_qry: this.state.formData.targetQuery,
			column: this.state.formData.column
		}
		this.props.updateTestCase(payload);
	}
	 handleCloseDialog = ()  => setShow(false)

	render() {
		console.log("this.props.viewTestCase", this.props.viewTestCase)
		return (
			<div>
				{ this.props.viewTestCase ?
					<Modal
						show={this.props.showTestCaseDialog}
						size="lg"
						aria-labelledby="contained-modal-title-vcenter"
						onHide={this.handleCaseDialogBoxClose}
						className="ModalMargin">
						<Modal.Header closeButton className="tableheaderborder">
							<Modal.Title id="contained-modal-title-vcenter">
								<label className="testViewHeading sub_title editcaselabe">Case Details :&nbsp;</label>
								<label className="testViewData sub_title">{this.props.viewTestCase.test_case_class}</label>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body className="tablecontent">
							{ this.props.showTestCaseEdit ?
								<form id="testEditMode">
									<Table id="editMode">
										<tbody>
											<tr className="selectconnectioneditbox ">
												<td className="other-titles"><label className="testViewDataLabel">Source Connection</label></td>
												<td>
													<select className="form-control"
														value={this.state.formData.sourceConnection}
														onChange={this.handleInputChange}
														name="sourceConnection"
													>
														{ this.renderConnectionsOptions() }
													</select>
												</td>
											</tr>
											<tr className="selectconnectioneditbox">
												<td className="other-titles">
													<label className="testViewDataLabel">Target Connection</label>
												</td>
												<td>
													<select className="form-control"
														value={this.state.formData.targetConnection}
														onChange={this.handleInputChange}
														name="targetConnection"
													>
														{ this.renderConnectionsOptions() }
													</select>
												</td>
											</tr>
											<tr className="selectconnectioneditbox1">
												<td className="other-titles">
													<label className="testViewDataLabel">Source Table</label>
												</td>
												<td>
													<FormGroup>
														<FormControl type="textbox" name="sourceTable"  value={this.state.formData.sourceTable} onChange={this.handleInputChange}/>
													</FormGroup>
												</td>
											</tr>
											<tr>
												<td className="other-titles"><label className="testViewDataLabel">Target Table</label></td>
												<td>
													<FormGroup>
														<FormControl type="textbox" name="targetTable" className="selectconnectioneditbox1" value={this.state.formData.targetTable} onChange={this.handleInputChange}/>
													</FormGroup>
												</td>
											</tr>
											
											<tr>
												<td className="other-titles"><label className="testViewDataLabel">Column</label></td>
												<td>
													<FormGroup>
														<FormControl type="textbox" className="selectconnectioneditbox1" name="column" value={this.state.formData.column} onChange={this.handleInputChange}/>
													</FormGroup>
												</td>
											</tr>

											<tr>
												<td className="other-titles"><label className="testViewDataLabel">Source Query</label></td>
												<td>
													<FormGroup>
														<textarea rows="4" name="sourceQuery" className="textarea1 selectconnectioneditbox1 " value={this.state.formData.sourceQuery} onChange={this.handleInputChange}/>
													</FormGroup>
												</td>
											</tr>
											<tr>
												<td className="other-titles"><label className="testViewDataLabel ">Target Query</label></td>
												<td>
													<FormGroup>
														<textarea rows="4" name="targetQuery" className="textarea1 selectconnectioneditbox1" value={this.state.formData.targetQuery} onChange={this.handleInputChange}/>
													</FormGroup>
												</td>
											</tr>
											<tr>
												<td className="other-titles"></td>
												<td>
													<Button className="backbutton_colors viewclosebtn" onClick={this.handleCaseDialogBoxClose}>Close</Button>
													<Button className="button-colors viewbackbtn" onClick={this.handleTestCaseViewMode}><i className="fas fa-long-arrow-alt-left"></i>&nbsp;View Details</Button>
													<Button className="button-colors updatebtnmargin" onClick={e => this.handleTestCaseUpdate(e)}>
														Update
													</Button>
												</td>
											</tr>
										</tbody>
									</Table>
								</form>
								:  
								<Table className="manageConnection" id="viewMode">
									<tbody>
										<tr>
											<td className="manageConnectionLabel"><label className="other-titles sublabelmargin">Source Connection</label></td>
											<td className="other-titles casesubtitles">{this.props.viewTestCase.src_connection_name}</td>
										</tr>
										<tr>
											<td className="manageConnectionLabel"><label className="other-titles sublabelmargin">Target Connection</label></td>
											<td className="other-titles casesubtitles">{this.props.viewTestCase.target_connection_name}</td>
										</tr>
										<tr>
											<td className="manageConnectionLabel"><label className="other-titles sublabelmargin">Source Table</label></td>
											<td className="other-titles casesubtitles">{this.props.viewTestCase.src_table}</td>
										</tr>
										<tr>
											<td className="manageConnectionLabel"><label className="other-titles sublabelmargin">Target Table</label></td>
											<td className="other-titles">{this.props.viewTestCase.target_table}</td>
										</tr>
										<tr>
											<td className="manageConnectionLabel"><label className="other-titles sublabelmargin">Column</label></td>
											<td className="other-titles casesubtitles">{this.props.viewTestCase.column}</td>
										</tr>
										<tr>
											<td className="manageConnectionLabel"><label className="other-titles sublabelmargin">Source Query</label></td>
											<td className="other-titles casesubtitles">{this.props.viewTestCase.sourceqry}</td>
										</tr>
										<tr>
											<td className="manageConnectionLabel"><label className="other-titles sublabelmargin">Target Query</label></td>
											<td className="other-titles casesubtitles">{this.props.viewTestCase.targetqry}</td>
										</tr>
										<tr>
											<Button className="backbutton_colors editclosebtn" onClick={this.handleCaseDialogBoxClose}>Close</Button>
											<Button className="button-colors goeditbtn" onClick={this.handleTestCaseEditMode}>Edit</Button>
										</tr>
									</tbody>
									
								</Table>
							}
						</Modal.Body>
						{/* <Modal.Footer className="tablefooterborder">
						</Modal.Footer> */}
					</Modal> : null
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showTestCaseDialog: state.testSuites.testCase.showTestCaseDialog,
		showTestCaseEdit:state.testSuites.showTestCaseEditEnabled,
		viewTestCase:state.testSuites.testCase,
		allConnections: state.testSuites.connectionsList && state.testSuites.connectionsList.allConnections? 
			state.testSuites.connectionsList.allConnections: []
	};
};

export default connect(mapStateToProps, {
	showTestCaseEditEnabled, 
	showTestCaseViewEnabled, 
	hideTestCaseDialog,
	updateTestCase,
})(TestCaseDetails);
