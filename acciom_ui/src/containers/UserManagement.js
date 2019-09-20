import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ListGroup, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';
import CustomPaginationActionsTable from '../components/Tables';

// import EnhancedTable from '../components/Tables';

import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
	textField:{
		float:'right',
		
	},
	label:{
	
		top:0,
		left:0
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
					<li key={index} className="list-group-item" >
						<Col sm={1}><i className="fa fa-user-circle usermanagelogo"></i></Col>
						<Col sm={7}>
							<span className="fName" >{user.first_name}</span>
							<span className="email" >{user.email}</span>
						</Col>
						<Col sm={4} className="editBtn">
							<Link to={`/edit_user_role/${user.user_id}`}>
								<Button type="button" className="button-colors" bsStyle="primary">Edit</Button>
							</Link>	
						</Col>
					</li>
				);
			});
		}
	
		return userList;
	};

	render() {
		const { isEditable,headers } = this.state;
		const{orgUserList,classes}=this.props;
		console.log('User management props',this.props);
		return (
			<div id="userManagement">
				<i class="fa fa-user-circle usericon" aria-hidden="true"></i>
				{/* <label className="main_titles usermanagetitle2">Users Mange</label> */}
				
				<label className={classes.label} >Users Mange</label>
			
	
			
		
			  <CustomPaginationActionsTable 
					headers={headers}
					userList ={orgUserList}
					/>
					
			
				{/* <ListGroup  className="listposition"> */}
					{/* { this.getOrgUserList() } */}
				
				
				{/* </ListGroup> */}
			
			
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserManagement));