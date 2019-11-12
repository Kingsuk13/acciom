import React, { Component } from "react";
import { compose } from 'redux';
import { connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ChangeOrganisation from '../components/ChangeOrganisation';
import SwitchProject from '../components/SwitchProject';
import { getOrganizationsList, getProjectListByOrgId, redirectToLoginPageComplete } from '../actions/appActions';
import { checkAuthentication } from '../actions/loginActions';

class RootContent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			authTokenExpired: false
		};
	}
	
	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.redirectToLoginPage) {
			nextProps.redirectToLoginPageComplete();
			nextProps.history.push('./login');
		} else if (nextProps.reloadOrgList) {
			nextProps.getOrganizationsList();
		} else if (nextProps.fetchProjectDetails) {
			const current_org_id = window.sessionStorage.getItem('current_organaisation_id')=="undefined" ? nextProps.currentOrg.org_id : window.sessionStorage.getItem('current_organaisation_id');
			nextProps.getProjectListByOrgId(current_org_id);
		}
		
		return null;
	};

	componentDidMount() {
		this.props.checkAuthentication();
	};

	render() {
		return (<div>
			<ToastContainer containerId='generic-toaste' autoClose={4000} />
			
			{ this.props.isOrgChangePageVisible ?
				<ChangeOrganisation />
				: null 
			}

			{ this.props.isProjectSwitchPageVisible ?
				<SwitchProject />
				: null 
			}
		</div>);
	};
}

const mapStateToProps = (state) => {
	return {
		isOrgChangePageVisible: state.appData.isOrgChangePageVisible,
		fetchProjectDetails: state.appData.fetchProjectDetails,
		isProjectSwitchPageVisible: state.appData.isProjectSwitchPageVisible,
		redirectToLoginPage: state.appData.redirectToLoginPage,
		reloadOrgList: state.appData.reloadOrgList,
		isOrganisationInitialised: state.appData.isOrganisationInitialised,
		currentOrg:  state.appData.currentOrg
	};
};

const mapDispatchToProps = dispatch => ({
	checkAuthentication: () => dispatch(checkAuthentication()),
	getOrganizationsList: (data) => dispatch(getOrganizationsList(data)),
	getProjectListByOrgId: (data) => dispatch(getProjectListByOrgId(data)),
	redirectToLoginPageComplete: () => dispatch(redirectToLoginPageComplete())
});

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter) (RootContent);