import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Button } from 'react-bootstrap';
import { retriveUserRoleByUserId, updateUserRoles } from '../actions/userManagementActions';
import { roleTypes } from '../reducers/userManagementReducer';
import RoleListItemContainer from './RoleListItemContainer';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const formatOrgProjectList = (currentOrg, projectList) => {
	const orgList = [{
		value: `o_${currentOrg.org_id}`, 
		label: currentOrg.org_name, 
		roleType: roleTypes.ORGANIZATION,
		uid: currentOrg.org_id
	}];

	const formattedProjectList = projectList.map((item) => {
		return { value: `p_${item.project_id}`, label: item.project_name, roleType: roleTypes.PROJECT, uid: item.project_id} ;
	});

	return [...orgList, ...formattedProjectList];
};

const getObjFromList = (list, key, value)=> list.find(v => v[key] === value);

class EditUserRoles extends Component {

	constructor (props) {
		super(props);
		this.state = {
			selectedUser: null,
			userRoleList: [],
			orgRoleList:[],
			orgProjectList: []
		};
	}

	componentDidMount () {
		const userId = (this.props.match && this.props.match.params) ? this.props.match.params.id : null;
		this.props.getSelectedUser(this.props.currentOrg.org_id, userId);
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.redirectToUserMgmtHome) {
			nextProps.history.push('/user_management');
		} else if (!prevState.selectedUser && nextProps.selectedUser) {
			
			const orgProjectList = formatOrgProjectList(nextProps.currentOrg, nextProps.projectList);

			let userRoleList = [];
			let orgRoleList = [];
			// organization roles
			if (nextProps.selectedUser.org_allowed_role_list.length > 0) {
				orgRoleList = [{
					id: `o_${nextProps.currentOrg.org_id}`, 
					allowed_role_list: nextProps.selectedUser.org_allowed_role_list, 
					roleType: roleTypes.ORGANIZATION,
					uid: nextProps.currentOrg.org_id
				}];
			}else{
				orgRoleList = [].concat(
					[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
				);
			}

			// project roles
			if (nextProps.selectedUser.project_role_list.length > 0) {
				const userProjectRoleList = nextProps.selectedUser.project_role_list.map((item) => {
					return {
						id: `p_${item.project_id}`, 
						allowed_role_list: item.allowed_role_list, 
						roleType: roleTypes.PROJECT,
						uid: item.project_id
					};
				});
				userRoleList = userRoleList.concat(userProjectRoleList);
			}else{
				userRoleList = [].concat(
					[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
				);
			}

			return {
				...prevState,
				selectedUser: nextProps.selectedUser,
				userRoleList,
				orgRoleList,
				orgProjectList
			};
		}

		return prevState;
	};

	onAddRowClick = () => {
		const userRoleList = [...this.state.userRoleList].concat(
			[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
		);

		this.setState({userRoleList});
	};

	onDeleteRowClick = (type, index) => {
		const userRoleList = [...this.state.userRoleList];
		userRoleList.splice(index, 1);
		this.setState({userRoleList});
	};

	onOrgProjectChange = (index, selectedOrgProject, category) => {
		if(category === 'PROJECT'){
			const userRoleList = [...this.state.userRoleList];
			userRoleList.splice(index, 1, 
				{	
					id: selectedOrgProject.value, 
					roleType: selectedOrgProject.roleType, 
					uid: selectedOrgProject.uid,  
					allowed_role_list:[]
				}
			);
		this.setState({userRoleList});
		}else{
			const orgRoleList = [...this.state.orgRoleList];
			orgRoleList.splice(index, 1, 
				{	
					id: selectedOrgProject.value, 
					roleType: selectedOrgProject.roleType, 
					uid: selectedOrgProject.uid,  
					allowed_role_list:[]
				}
			);
			this.setState({orgRoleList});
		}
	};

	onRoleChange = (index, roles, category) => {
		if(category === 'PROJECT'){
			const userRoleList = [...this.state.userRoleList];
			const listItem = userRoleList[index];

			const allowed_role_list = roles.target.value.map((role) =>{
				return role.value;
			});
			
			userRoleList.splice(index, 1, {...listItem, allowed_role_list});
			this.setState({userRoleList});
		}else{
			const orgRoleList = [...this.state.orgRoleList];
			const listItem = orgRoleList[index];

			const allowed_role_list = roles.target.value.map((role) =>{
				return role.value;
			});
			
			orgRoleList.splice(index, 1, {...listItem, allowed_role_list});
			this.setState({orgRoleList});
		}
		
	};

	getSelectedOrgProject = (id) => {
		return getObjFromList(this.state.orgProjectList, 'value', id);
	};

	getRoleItemComponent = (list,type) => {
		let roleElements = [];
		const count = list.length;
		const projectList = this.state.orgProjectList.filter((e) => e.roleType === type );
		roleElements = list.map((item, index) => {
			let showAdd = false;
			let showDelete = true;
			if (count === 1) {
				showDelete = false;
			}
			if (count-1 === index) {
				showAdd = true;
			}
			if(type === 'ORGANIZATION')
				showAdd = false;

			return (
				<li key={`${item.roleType}${index}`}>
					<RoleListItemContainer 
						onAddRowClick={this.onAddRowClick}
						onDeleteRowClick={this.onDeleteRowClick}
						showAddBtn={showAdd && list.length === (index+1)}
						showDeleteBtn={(!showDelete && list.length === 1)? false : true }
						index={index} 
						roleType={item.roleType}
						orgProjectList = {projectList}
						selectedOrgProject = { getObjFromList(projectList, 'value', item.id) }
						id={item.id}
						selectedRoles = {item.allowed_role_list}
						onOrgProjectChange = {this.onOrgProjectChange}
						onRoleChange = {this.onRoleChange}
						category={type}
					/>
				</li>
			);
		});

		return roleElements;
	};

	renderUserRoles = () => {
		let element = []; 
		if (this.state.userRoleList.length > 0) {
			element.push(
				(
				<li>
					<div>
						<span className="projectLabel">
							Organisation
						</span>
						<span className="projectRoleLabel">
							Roles
						</span>
					</div>
				</li>
				)
			);
			element.push(
				this.getRoleItemComponent(this.state.orgRoleList,"ORGANIZATION")
			);
			element.push(
				(
				<li>
					<div>
						<span className="projectLabel">
							Project
						</span>
						<span className="projectRoleLabel">
							Roles
						</span>
					</div>
				</li>
				)
			);
			element.push(
				this.getRoleItemComponent(this.state.userRoleList,"PROJECT")
			)
			// element = this.getRoleItemComponent(this.state.userRoleList);
			if (element.length > 0) {
				element.push(
					(<div class='footer'>
						<table>
							<tr>
								<td style={{ width: '93.2%' }}>
								<Link to={`/user_management`}>
							<button type="button" className="editUserRoleBackbtn backbutton_colors" bsStyle="primary">Back</button>
						</Link>
								</td>
								<td>
						<button type="button" className="editRolesaveButton button-colors" bsStyle="primary" onClick={(e) => {this.onSaveUserRoles()}}>Save</button>
									
								</td>
							</tr>
						</table>
						
					</div>)
				);
			}
		}

		return element;
	};

	onSaveUserRoles = () => {
		// build payload
		const projectRoleList = [];
		let orgAllowedRoleList = []; 
		this.state.userRoleList.forEach((item) => {
				projectRoleList.push(
					{
						'project_id': item.uid,
						'allowed_role_list': item.allowed_role_list
					}
				);
		});
		this.state.orgRoleList.forEach((item) => {
			orgAllowedRoleList = orgAllowedRoleList.concat([...item.allowed_role_list]);
		});

		const payload = {
			'org_id': this.props.currentOrg.org_id,
			//'user_id': this.props.selectedUser.user_id,
			'email_id': this.props.selectedUser.email_id,
			'project_role_list': projectRoleList,
			'org_allowed_role_list': orgAllowedRoleList
		};
		this.props.updateUserRoles(JSON.stringify(payload));
	};
	
	render() {
		return (
			
			<div id="editUserRoles">
				<PersonAddIcon className="editRoleEditIcon" />
				<h3 className="usermanagetitle main_titles">Manage User Role</h3>
				<Paper className="editRolePaper">
				<div className = "DescriptionHeader sub_title submailtitle" className="maillabel sub_title">Email:</div>
				<div className="maillabel1 other-titles">{this.props.selectedUser? this.props.selectedUser.email_id: ''}</div>
				<table>
				<tr>
					<td><div className="sub_title usernamelabel">First Name:&nbsp;&nbsp;
					<label className="lnameMargin">{this.props.selectedUser? this.props.selectedUser.first_name: ''}</label></div></td>
				<td><div className="sub_title lastNameLabel">Last Name:&nbsp;&nbsp;
				<label className="lnameMargin">{this.props.selectedUser? this.props.selectedUser.last_name: ''}</label></div></td>
				</tr>
				</table>
				<div className="rolesborder">
				{ this.renderUserRoles() }
				</div>
				</Paper>

			</div>
		
		);
	 }
}

const mapStateToProps = (state) => {
	return {
		currentOrg: state.appData.currentOrg,
		selectedUser: state.userManagementData.selectedUser,
		projectList: state.appData.projectList,
		userOrgRoleList: state.userManagementData.userOrgRoleList,
		userProjectRoleList: state.userManagementData.userProjectRoleList,
		userNewRoleList: state.userManagementData.userNewRoleList,
		redirectToUserMgmtHome: state.userManagementData.redirectToUserMgmtHome
	};
};

const mapDispatchToProps = dispatch => ({
	getSelectedUser: (org_id, user_id) => dispatch(retriveUserRoleByUserId(org_id, user_id)),
	updateUserRoles: (data) => dispatch(updateUserRoles(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUserRoles);