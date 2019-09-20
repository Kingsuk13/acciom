import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { showProjectSwitchPage, updateSelectedProject } from '../actions/appActions';

class SwitchProject extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedProjectId: ''
		};
	}

	componentDidMount() {
		this.setState({selectedProjectId: this.props.currentProject.project_id});
	}

	handleProjectChange = (e) => {
		this.setState({selectedProjectId: e});
	};

	renderProjectListOptions = () => {
		const options = this.props.projectList.map((item) => {
			return { value: item.project_id, label: item.project_name} ;
		});
		return options;
	};
	render () {
		const hidePopup  = () => {
			this.props.showProjectSwitchPage(false);
		};
		const styles = {
			option: (styles, state) => ({
			  ...styles,
			  color: state.isSelected ? "black" : null
			})
		};
		
		const onSubmit = (e) => {
			e.preventDefault();
			// 
			let selectedProject = null;
			const list = this.props.projectList;
			for(let i = 0; i < list.length; i += 1) {
				if(Number(list[i]['project_id']) === Number(this.state.selectedProjectId.value)) {
					selectedProject = list[i];
					break;
				}
			}
			this.props.updateSelectedProject(selectedProject);
		};

		return (

			<Modal id="orgChangeModal" show={this.props.isProjectSwitchPageVisible} 
				onHide={(event) => { hidePopup()}} container={this}
				aria-labelledby="contained-modal-title" bsSize="medium" className="switchprojectpopbox">

				<Modal.Header closeButton className="switchprojectpopbox main_title switchprojectpopboxheader">
					<Modal.Title id="contained-modal-title" >
						<span className="sub_title">Switch Project</span>
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<form onSubmit={(e) => onSubmit(e)}> 
						<FormGroup controlId="project">
							<Col sm={6}><ControlLabel className="selectlabel chnageorglabel">Select the new project: </ControlLabel></Col>
							<Col sm={6}>
								{/* <FormControl componentClass="select" className="editbox" placeholder="select" value={this.state.selectedProjectId} onChange = {(e) => handleProjectChange(e)}>
									{ renderProjectListOptions() }
								</FormControl> */}
								<Select 
									className="changeorgdropdown"
									theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' }, })}
									value={this.state.selectedOrgId}
									onChange={ (item) => this.handleProjectChange(item) }
									options= { this.renderProjectListOptions() }
									styles={styles}
								/>
							</Col>
						</FormGroup >
						<FormGroup controlId="submit" className="submitBtn">
							<Button controlId="close" className="backbutton_colors cancelbtn" onClick={(event) => { hidePopup()}} container={this}>Cancel</Button>
							<Button type="submit" className="button-colors savebtn">Save</Button>
						</FormGroup>
					</form>
				</Modal.Body>
			</Modal>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		isProjectSwitchPageVisible: state.appData.isProjectSwitchPageVisible,
		projectList: state.appData.projectList,
		currentProject: state.appData.currentProject
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data)),
		updateSelectedProject: (data) => dispatch(updateSelectedProject(data)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps) (SwitchProject);