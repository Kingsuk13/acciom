import React, { Component } from 'react';
import { connect } from 'react-redux';
import PersonIcon from '@material-ui/icons/Person';
import { showOrgChangePage, updateSelectedOrganization, getProjectListByOrgId } from '../actions/appActions';
import { showProjectSwitchPage, updateSelectedProject } from '../actions/appActions';
import { userProfilesDetailes, updateUserProfileNames,userProfileDropdown, clearUserData } from '../actions/userManagementActions';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';


class UserProfile extends Component{

    useStyles = makeStyles(theme => ({
        root: {
        padding: theme.spacing(3, 2),
        },
    }));
    constructor(props) {
		super(props);
		this.state = {
            selectedOrgId: '',
            selectProjectId:'',
            profileDetails: {
                email_id: '',
                first_name: '',
                last_name: ''
            }

        };
this.handleOrgChange = this.handleOrgChange.bind(this)
	}

    handleInputChange = (event) => {
        event.preventDefault();
        const key = event.target.name;
        const value = event.target.value;
        let profileDetails = {...this.state.profileDetails};
        profileDetails[key]=value;
        this.setState({
            profileDetails : profileDetails
        });
	}

    componentDidMount(){
        this.props.userProfilesDetailes();
        this.onloadSaveValues();
    }

    componentWillUnmount(){
        this.props.clearUserData();
    }


    onloadSaveValues(){
        if ( this.props.currentOrg) {
            this.setState({selectedOrgId: this.props.currentOrg.org_id});
            this.setState({selectProjectId: this.props.currentProject.project_id});
        }
    }


    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.userProfiles.email_id !== prevState.profileDetails.email_id) {
			const profileDetails = nextProps.userProfiles;
			return { ...prevState, profileDetails };
        }
        if (nextProps.currentOrg ? nextProps.currentOrg.org_id !== prevState.selectedOrgId : false) {
            return{...prevState, selectedOrgId: nextProps.currentOrg.org_id, selectProjectId: nextProps.currentProject.project_id};
        }
    }


    userProfileSubmit = () => {
        this.props.updateUserProfileNames(this.state.profileDetails);
    }
    
    renderOrgListOptions = () => {
		const options = this.props.orgList.map((item) => {
			return { value: item.org_id, label: item.org_name};
		});
        return options;
	};
	handleOrgChange = (e) => {
        this.setState({selectedOrgId: e.target.value});
        this.props.getProjectListByOrgId(e.target.value);
    };
    renderProjectListOptions=()=>{
        const options = this.props.projectList.map((item, index) => {
			return { value: item.project_id, label: item.project_name}; 
        });
		return options;
    };
    handleProjectChange =(e)=>{
        this.props.userProfileDropdown(e.target.value);
        
    };

    render(){
        const { profileDetails } = this.state;
        return(
            <div>
                <table>
                    <tr>
                        <td><PersonIcon className="userAccount"/></td>
                        <td><label className="main_titles userProfileTitle">User Profile</label></td>
                    </tr>
                </table>
            <Paper className="UserProfilePaper">
                <table>
                    <tr>
                        <td>
                        <TextField
                        className="userProfileFname"
						name="first_name"
						label="First Name"
                        margin="normal"
                        value = {profileDetails.first_name}
						onChange = {this.handleInputChange}
						/>
                        </td>
                        <td>
                        <TextField
						className="userProfileLname"
						name="last_name"
						label="Last Name"
                        margin="normal"
                        value = {profileDetails.last_name}
						onChange = {this.handleInputChange}
						/>
                        </td>
                        <td>
                        <TextField
                        className="userProfileEmail"
						name="email_id"
						label="Email"
                        margin="normal"
                        value = {profileDetails.email_id}
                        disabled = {profileDetails.email_id}
                        />
                        </td>
                        <td><Button variant="contained" onClick={() => this.userProfileSubmit()} className="button-colors userSubmitButton">Submit</Button></td>
                    </tr>
                </table>
                <div>
                    <table>
                        <tr>
                            <td><label className="userProfileLabel">Set Default Organization</label></td>
                            <td><label className="userProfileProjectLabel">Set Default Project</label></td>
                        </tr>
                        <tr>
                            <td>
                            <Select  
                            className="select_organization_default"
                            value={this.state.selectedOrgId}
                            onChange={ (item) => this.handleOrgChange(item) }
                            >
                            {this.renderOrgListOptions().map((data, index) => (
                            <MenuItem key={index} value={data.value}>{ data.label }</MenuItem>
                            ))}
                            </Select>
                            </td>
                            <td>
                            <Select 
                            className="select_Project_default"
                            value={this.state.selectProjectId}
                            onChange={ (item) => this.handleProjectChange(item) }
                            >
                            {this.renderProjectListOptions().map((data, index) => (
                            <MenuItem key={index} value={data.value}>{ data.label }</MenuItem>
                            ))}
                            </Select>
                            </td>
                        </tr>
                    </table>
                </div>
            </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		orgList: state.appData.organizationList,
        currentOrg: state.appData.currentOrg,
        projectList:state.appData.projectList,
        currentProject:state.appData.currentProject,
        userProfiles:state.userManagementData.UserProfileDetails,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateSelectedOrganization: (data) => dispatch(updateSelectedOrganization(data)),
        getProjectListByOrgId: (data) => dispatch(getProjectListByOrgId(data)),
        userProfilesDetailes: () => dispatch(userProfilesDetailes()),
        clearUserData: () => dispatch(clearUserData()),
        updateUserProfileNames: (data) => dispatch(updateUserProfileNames(data)),
        userProfileDropdown: (data) => dispatch(userProfileDropdown(data)),
        showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data)),
        updateSelectedProject: (data) => dispatch(updateSelectedProject(data)),
        
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)