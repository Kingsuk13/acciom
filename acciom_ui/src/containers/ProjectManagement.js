import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ListGroup, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';

class ProjectManagement extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isOrganisationInitialised: false,
			isEditable : false
		};
	}
	
	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (!prevState.isOrganisationInitialised && 
			nextProps.isOrganisationInitialised > 0) {
			let orgId = 1;//TODO: hard coded value. To be cleaned up after org switch
			nextProps.getOrganizationUsersList(orgId);
		}
		return ({
			isOrganisationInitialised: nextProps.isOrganisationInitialised
		});
	};
	
	showEditContent = (user) => {
		this.setState({isEditable: true});
	};

	getOrgProjectList = () => {
		return (
			<li  className="list-group-item" >
				<Col sm={1}><i className="fas fa-user-circle"></i></Col>
				<Col sm={7}>
					<span className="fName" >Project1</span>
					<span className="email" >Project2</span>
				</Col>
				<Col sm={4} className="editBtn">
					<Button type="button" bsStyle="primary">Edit</Button>
				</Col>
			</li>
		);
	}
		
	render() {
		const { isEditable } = this.state;
		return (
			<div>
				<h1>Project Management Page</h1>
				{this.getOrgProjectList()}
			</div>
		);
	 }
}

// const mapStateToProps = (state) => {
// 	console.log('UserManagement.mapStateToProps() ', state);
// 	return {
// 		orgUserList: state.userManagementData.orgUserList? state.userManagementData.orgUserList: [],
// 		projectList: state.appData.projectList? state.appData.projectList: [],
// 		isOrganisationInitialised: state.appData.isOrganisationInitialised
// 	};
// };

// const mapDispatchToProps = dispatch => ({
// 	getOrganizationUsersList: (data) => dispatch(getOrganizationUsersList(data))
// });

// export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);

export default ProjectManagement;