import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';
import { ListGroup,Table, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList,addOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';
import CustomPaginationActionsTable from '../components/Tables';
import GroupIcon from '@material-ui/icons/Group';


import { withStyles } from '@material-ui/core/styles';
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
		marginLeft:'3px'
	}
});

class UserManagement extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isOrganisationInitialised: false,
			isEditable : false,
		
			 headers : [
				{ id: 'first_name',  label: 'FirstName' },
				{ id: 'last_name',  label: 'LastName' },
				{ id: 'email', label: 'Email' },
				{ id: 'Action',  label: 'Action' },
			
			  ],
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
		const { isEditable,headers } = this.state;
		const{orgUserList,classes}=this.props;
	
		return (
			<div id="userManagement">
			<div>
            <GroupIcon className={classes.IconClass}/>
			&nbsp; &nbsp;
			<label className="main_titles" >Users Mange</label>
			
				
			</div>
				
				
			
	
			
		
			  <CustomPaginationActionsTable 
					headers={headers}
					userList ={orgUserList}
					// addBtnFunctionality ={this.addRowsinTable}
				
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
	// addOrganizationUsersList:(data) =>dispatch(addOrganizationUsersList(data))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserManagement));