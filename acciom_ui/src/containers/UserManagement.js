import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';
import { ListGroup,Table, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList,addOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';
import GroupIcon from '@material-ui/icons/Group';
import CustomTable from '../components/Table/CustomTable'
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const styles = theme => ({
	textField:{
		float:'right',
		
	},
	label:{
	
		top:0,
		left:0
	},
	IconClass:{
		marginBottom:'-5px',
		marginLeft:'3px',
		color:'#69717D',
		fontSize:'20px'
	}
});

class UserManagement extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isOrganisationInitialised: false,
			isEditable : false,
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

	render() {
		const{orgUserList,classes}=this.props;

		const headers = [
			{ id: 'first_name',  label: 'First Name' },
			{ id: 'last_name',  label: 'Last Name' },
			{ id: 'email', label: 'Email' }
		  ];

		  const userList = [];
			if (orgUserList) {
				orgUserList.forEach(user => {
					userList.push({
						first_name: user.first_name,
						last_name: user.last_name,
						email: user.email,
						action: (
							<Link to={`/edit_user_role/${user.user_id}`}>
								<EditIcon fontSize="small" className="editicon2" style={{color:"#696969" ,marginRight:'35px'}} />
							</Link>	
						)
					})
				})
			
			}
			
		return (
			<div id="userManagement">
				<div>
					<GroupIcon className="manageUsersIcon" />
					&nbsp; &nbsp;
					<label className="main_titles" >Manage Users</label>
					<Link to="/ManageUserRole">
					<Tooltip title="Add User" placement="right">
					<IconButton className="addUserButton">
					<PersonAddIcon  />
					</IconButton>
					</Tooltip>
					</Link>
				</div>				
				<CustomTable 
					headers={headers}
					bodyData={userList}
					actionLabel="Manage Role"
					variant ="UserTable"
				/>
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
	getOrganizationUsersList: (data) => dispatch(getOrganizationUsersList(data)),


});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserManagement));