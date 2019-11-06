import React from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { connect } from 'react-redux';
import { Modal,FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { showOrgChangePage, updateSelectedOrganization, getProjectListByOrgId } from '../actions/appActions';

class ChangeOrganisation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedOrgId: ''
		};
	}

	componentDidMount() {
		const currentOrg = { value: this.props.currentOrg.org_id, label: this.props.currentOrg.org_name };
		this.setState({selectedOrgId: currentOrg});
	}

	renderOrgListOptions = () => {
		const options = this.props.orgList.map((item) => {
			return { value: item.org_id, label: item.org_name} ;
		});
		return options;
	};

	handleOrgChange = (e) => {
		this.setState({selectedOrgId: e});
	};

	render () {
		
		const handleShowOrg  = (isShow) => {
			this.props.showOrgChangePage(isShow);
		};

		const onChangeOrgSubmit = (e) => {
			e.preventDefault();
			// 
			let selectedOrg = null;
			for(let i = 0; i <  this.props.orgList.length; i += 1) {
				if(Number(this.props.orgList[i]['org_id']) === Number(this.state.selectedOrgId.value)) {
					selectedOrg = this.props.orgList[i];
					break;
				}
			}
			this.props.updateSelectedOrganization(selectedOrg);
			this.props.getProjectListByOrgId(selectedOrg.org_id);
		};

		const styles = {
			option: (styles, state) => ({
			...styles,
			color: state.isSelected ? "black" : null
			})
		};
		
		return (
			<Modal id="orgChangeModal" show={this.props.isOrgChangePageVisible} 
				onHide={(event) => { handleShowOrg(false);}} container={this}
				aria-labelledby="contained-modal-title" bsSize="medium" className="switchprojectpopbox">

				<Modal.Header closeButton className="switchprojectpopboxheader">
					<Modal.Title id="contained-modal-title" className="sub_title">
						Change Organisation
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<form onSubmit={(e) => onChangeOrgSubmit(e)}> 
						<FormGroup controlId="organisation">
							<Col sm={6}><ControlLabel className="chnageorglabel label2">Select the organisation to be changed</ControlLabel></Col>
							<Col sm={6}>
								<Select 
									className="changeorgdropdown"
									theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' }, })}
									value={this.state.selectedOrgId}
									onChange={ (item) => this.handleOrgChange(item) }
									options= { this.renderOrgListOptions() }
									styles={styles}
								/>
							</Col>
						</FormGroup >
						<FormGroup controlId="submit" className="submitBtn">
							<Button variant="contained"  className="backbutton_colors closebtn" onClick={(event) => { handleShowOrg(false);}}>Cancel</Button>
							<Button variant="contained"  type="submit" className="button-colors chngorgsavebtn">Save</Button>
						</FormGroup>
					</form>
				</Modal.Body>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isOrgChangePageVisible: state.appData.isOrgChangePageVisible,
		orgList: state.appData.organizationList,
		currentOrg: state.appData.currentOrg
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showOrgChangePage: (data) => dispatch(showOrgChangePage(data)),
		updateSelectedOrganization: (data) => dispatch(updateSelectedOrganization(data)),
		getProjectListByOrgId: (data) => dispatch(getProjectListByOrgId(data))
	}
};

export default connect(mapStateToProps, mapDispatchToProps) (ChangeOrganisation);