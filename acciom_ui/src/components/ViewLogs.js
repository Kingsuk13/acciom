import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import ViewLogDetails from './ViewLogDetails';

import { hideCaseLogDialog } from '../actions/testSuiteListActions';

class CaseLogs extends React.Component {
	handleCaseLogDialogBoxClose = () => {
		 this.props.hideCaseLogDialog();
	};

	render() {
		return (
			<div>
				<Modal
					show={this.props.showCaseLogDialog}
					size="xl"
					aria-labelledby="contained-modal-title-vcenter"
					onHide={this.handleCaseLogDialogBoxClose}
					//className="caseLogMargin"
					dialogClassName="caselogbodymargin">
					<Modal.Header closeButton className="logheaderborder">
						<Modal.Title id="contained-modal-title-vcenter">
							{/* <label className="main_titles">Log Details</label> */}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="logbody">
						<ViewLogDetails />
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showCaseLogDialog: state.testSuites.testCaseLog.showCaseLogDialog,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		hideCaseLogDialog: () => dispatch(hideCaseLogDialog())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseLogs);