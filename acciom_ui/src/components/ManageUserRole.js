import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { emailExsistingVerify, addUserOnload, updateUserRoles } from '../actions/userManagementActions';
import { roleTypes } from '../reducers/userManagementReducer';
import RoleListItemContainer from '../containers/RoleListItemContainer';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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

class ManageUserRole extends Component{
    constructor(props){
		super(props)
		const userRoleList = [].concat(
			[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
		);
		const orgRoleList = [].concat(
			[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
		);
		//const orgProjectList = formatOrgProjectList(props.currentOrg, props.projectList);
        this.state = {
            email: "",
            selectedUser: null,
			userRoleList: userRoleList,
			orgProjectList: [],
			firstname: "",
			lastname: "",
			orgRoleList: orgRoleList,
			showPermission: false,
			disableEmail: false,
		}
		this.handleInputChange = this.handleInputChange.bind(this)
	}
	
    emailVerify = () => {
		const { email, disableEmail } = this.state;
		if (disableEmail){
			this.setState({
				disableEmail: false
			})
		} else {
			this.setState({
				disableEmail: true
			})
			this.props.emailExsistingVerify(email);
		}
    }

    handleInputChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })

	}
	
	componentWillUnmount() {
		this.props.addUserOnload();
	}

	
    static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.redirectToUserMgmtEdit && nextProps.emailUserID !== "show") {
			nextProps.history.push(`/edit_user_role/${nextProps.emailUserID}`);
		}
		if (nextProps.emailUserID === "show") {
			const showPermission = true;
			return { ...prevState, showPermission };
		} 
		if (nextProps.currentOrg && nextProps.projectList) {
			const orgProjectList = formatOrgProjectList(nextProps.currentOrg, nextProps.projectList);
			return { ...prevState, orgProjectList };
		}
		return prevState;
	};
	renderUserRoles = () => {
		let element = []; 
		if (this.state.userRoleList.length > 0) {
			element.push(
				(
				<li className="listDots">
					<div>
						<span className="projectLabel ">
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
				<li className="listDots">
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
			// element = this.getRoleItemComponent(this.state.userRoleList,"PROJECT");
			if (element.length > 0) {
				element.push(
					(<div className='footer'>
						<table>
							<tr>
								<td style={{ width: '93.2%' }}>
								<Link to={`/user_management`}>
								<Button type="button" variant="contained" className="backbutton_colors adduserBackButton" bsStyle="primary">Back</Button>
								</Link>
								</td>
								<td>
								<Button type="button" variant="contained" className="button-colors adduserSaveButton" bsStyle="primary" onClick={(e) => {this.onSaveUserRoles()}} >Save</Button>
								</td>
							</tr>
						</table>
					</div>)
				);
			}
		}

		return element;
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

	validateFields = () => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (this.state.firstname && this.state.firstname && this.state.email && re.test(String(this.state.email).toLowerCase()))
		{
			return false;
		}
		return true;
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
				<li key={`${item.roleType}${index}`} className="listDots">
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
			'first_name': this.state.firstname,
			'last_name' : this.state.lastname,
			'org_id': this.props.currentOrg.org_id,
			'email_id': this.state.email,
			'project_role_list': projectRoleList,
			'org_allowed_role_list': orgAllowedRoleList
		};
		this.props.updateUserRoles(JSON.stringify(payload));
	};

    render(){
		const { showPermission, disableEmail } = this.state;
        return(
			
            <div>
				<table>
					<tr>
						<td>
							<PersonAddIcon className="addUserIcon" />
						</td>
						<td><div className="main_titles manageUserRoleTitles">Manage User Role</div></td>
					</tr>
				</table>
				<Paper className="addUserPaper">
            <table>
                <tr>
					<td>
					
					<TextField
						className="editRoleFnameLabel"
						name="firstname"
						label="First Name"
						value={this.state.firstname}
						onChange = {this.handleInputChange}
						margin="normal"
						disabled={disableEmail}
					/>
					</td>
                    <td><TextField
						className="editRoleLanameLabel"
						id="standard-name"
						name="lastname"
						label="Last Name"
						value={this.state.lastname}
						onChange = {this.handleInputChange}
						margin="normal"
						disabled={disableEmail}
					/>
					</td>
                    <td>
					<TextField
						className="emailEditBox"
						name="email"
						label="Email"
						value={this.state.email}
						onChange = {this.handleInputChange}
						margin="normal"
						disabled={disableEmail}
					/>
					</td>
					<td>
						<Button variant="contained" className="button-colors verifyButtons"  disabled={this.validateFields()} 
						onClick={() => this.emailVerify()}>{disableEmail ? 'Edit' : 'Verify'}</Button>
					</td>
                </tr>
				<tr>
				</tr>
            </table>
			<div className="rolesborder">
				{ showPermission && disableEmail && this.renderUserRoles() }
			</div>
			</Paper>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => ({
    getSelectedUser: (org_id, user_id) => dispatch(retriveUserRoleByUserId(org_id, user_id)),
	emailExsistingVerify: (data) => dispatch(emailExsistingVerify(data)),
	addUserOnload: () => dispatch(addUserOnload()),
	updateUserRoles: (data) => dispatch(updateUserRoles(data))
})

const mapStateToProps = (state) => {
	return {
		orgProjectRolesList: state.userManagementData.orgProjectRolesList,
        authTokenExpired: state.loginData.authTokenExpired,
        currentOrg: state.appData.currentOrg,
		selectedUser: state.userManagementData.selectedUser,
		projectList: state.appData.projectList,
		userOrgRoleList: state.userManagementData.userOrgRoleList,
		userProjectRoleList: state.userManagementData.userProjectRoleList,
		userNewRoleList: state.userManagementData.userNewRoleList,
		redirectToUserMgmtEdit: state.userManagementData.redirectToUserMgmtEdit,
		emailUserID: state.userManagementData.emailUserID,
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageUserRole);