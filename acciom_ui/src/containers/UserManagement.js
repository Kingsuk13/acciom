import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';
import { ListGroup,Table, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';

class UserManagement extends Component {
	
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
			nextProps.getOrganizationUsersList(nextProps.currentOrg.org_id);
		}
		return ({
			
			isOrganisationInitialised: nextProps.isOrganisationInitialised
		});
	}

	getOrgUserList = () => {
		let userList = '';
		if (this.props.orgUserList.length > 0) {
			userList = this.props.orgUserList.map((user, index) =>{
				return (
					<tr key={index}>
						<td>
						{/* <i className="fa fa-user-circle usermanagelogo"></i> */}
						
							<span className="fName" >{user.first_name}</span></td>
							<span className="lname">{user.last_name}</span>
							<td><span className="email" >{user.email}</span></td>
						
						
							<td><Link to={`/edit_user_role/${user.user_id}`}>
								{/* <Button type="button" className="button-colors" bsStyle="primary">Edit</Button> */}
								<EditIcon fontSize="small" className="editicon2" style={{color:"#696969"}} />
							</Link></td>	
						
					</tr>
				);
			});
		}

		return userList;
	};

	render() {
		const { isEditable } = this.state;
		console.log("this.props.orgUserList", this.props.orgUserList)
		return (
			<div id="userManagement">
				<i class="fa fa-users usericon2" aria-hidden="true"></i>
				<label className="main_titles usermanagetitle2">Manage User Roles</label>
				<Table  className="manageuserrolestable">
					<thead>
						<tr className="manageuserrolestablehead">
							<th>Firstname</th>
							<th>Lastname</th>
							<th>Email</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody className="hovercolor">
					{ this.getOrgUserList() }
					</tbody>
				</Table>
			</div>
		);
	 }
}

const mapStateToProps = (state) => {
	return {
		currentOrg: state.appData.currentOrg,
		orgUserList: state.userManagementData.orgUserList? state.userManagementData.orgUserList: [],
		projectList: state.appData.projectList? state.appData.projectList: [],
		isOrganisationInitialised: state.appData.isOrganisationInitialised
	};
};

const mapDispatchToProps = dispatch => ({
	getOrganizationUsersList: (data) => dispatch(getOrganizationUsersList(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);