import { 
	GET_ORGANIZATION_LIST_SUCCESS, 
	GET_ORGANIZATION_LIST_ERROR,
	GET_PROJECT_LIST_BY_ORG_ID_SUCCESS, 
	SHOW_ORG_CHANGE_PAGE,
	SWITCH_ORG_SUCCESS,
	SWITCH_PROJECT_SUCCESS,
	SHOW_PROJECT_SWITCH_PAGE,
	AUTHENTICATION_EXPIRED,
	LOGOUT_FROM_PORTAL_SUCCESS,
	REDIRECT_TO_LOGIN_COMPLETE,
	LOGIN_TO_PORTAL_SUCCESS
} from '../constants/ActionTypes';

const initialState = {
	organizationList: [],
	currentOrg: null,	
	projectList: [],
	currentProject: 1,
	isOrgChangePageVisible: false,
	isProjectSwitchPageVisible: false,
	isOrganisationInitialised: false,
	fetchProjectDetails: false,
	redirectToLoginPage: false,
	reloadOrgList: false,
};

const appData = (state = initialState, action) => {
	switch (action.type) {
	case LOGIN_TO_PORTAL_SUCCESS:
		return {
			...state,
			reloadOrgList: true
		};

	case GET_ORGANIZATION_LIST_SUCCESS:
		
		const currentOrgId = window.sessionStorage.getItem('default_org_id');
		let currentOrg = null;
		if (currentOrgId){;
		action.response.data.organization_details.forEach((item) => {
			if (currentOrgId == item.org_id){
				currentOrg = item;
			}
		});}
		return {
			...state,
			organizationList: action.response.data.organization_details,
			currentOrg: currentOrg || action.response.data.organization_details[0],
			fetchProjectDetails: true,
			isOrganisationInitialised: true,
			reloadOrgList: false
		 };
	
	case GET_ORGANIZATION_LIST_ERROR:
		return {
			...state,
			organizationList: []
		 };	
	
	case GET_PROJECT_LIST_BY_ORG_ID_SUCCESS:
			const currentProjectId = window.sessionStorage.getItem('default_project_id');
			let currentProject = null;
			action.response.data.projects_under_organization.project_details.forEach((item) => {
				if (currentProjectId == item.project_id){
					currentProject = item;
				}
			})
		return {
			...state,
			projectList: action.response.data.projects_under_organization.project_details,
			currentProject: currentProject || action.response.data.projects_under_organization.project_details[0],
			fetchProjectDetails: false
		};

	case SHOW_ORG_CHANGE_PAGE:
		return {
			...state,
			isOrgChangePageVisible: action.show
		};

	case SHOW_PROJECT_SWITCH_PAGE:
		return {
			...state,
			isProjectSwitchPageVisible: action.show
		};

	case SWITCH_ORG_SUCCESS:
		return {
			...state,
			currentOrg: action.org,
			isOrgChangePageVisible:false
		};

	case SWITCH_PROJECT_SUCCESS:
		return {
			...state,
			currentProject: action.project,
			isProjectSwitchPageVisible:false
		};
	
	case AUTHENTICATION_EXPIRED:
	case LOGOUT_FROM_PORTAL_SUCCESS:		
		return {
			...state,
			redirectToLoginPage: true,
			reloadOrgList: false
		};
	
	case REDIRECT_TO_LOGIN_COMPLETE:
		return {
			...state,
			redirectToLoginPage: false
		}
	default:
		return state;
	}
};

export default appData;