import { 
	GET_ORGANIZATION_LIST_SUCCESS, 
	GET_ORGANIZATION_LIST_ERROR, 
	AUTHENTICATION_EXPIRED,
	GET_PROJECT_LIST_BY_ORG_ID_SUCCESS,
	GET_PROJECT_LIST_BY_ORG_ID_ERROR,
	GET_PROJECT_LIST_BY_ORGANAISATION_ID_SUCCESS,
	GET_PROJECT_LIST_BY_ORGANAISATION_ID_ERROR,
	SHOW_ORG_CHANGE_PAGE,
	SHOW_PROJECT_SWITCH_PAGE,
	SWITCH_ORG_SUCCESS,
	SWITCH_PROJECT_SUCCESS,
	REDIRECT_TO_LOGIN_COMPLETE,
	CHANGE_ORG_DROPDOWN
} from '../constants/ActionTypes';

export const TIMEOUT = 100;
export const BASE_URL= 'http://172.16.21.192:5000/api';
export const LOCAL_BASE_URL= 'http://172.16.17.179:5000/api';
// export const BASE_URL= 'http://172.16.19.156:5000/api';
export const headers = {
	'Content-Type': 'application/json',
	'Authorization':''
};

export const updateHeaders = (authToken) => {
	headers.Authorization = `Bearer ${authToken}`;
};

export const showOrgChangePage = show =>({
	type: SHOW_ORG_CHANGE_PAGE,
	show
});

export const showProjectSwitchPage = show =>({
	type: SHOW_PROJECT_SWITCH_PAGE,
	show
});

export const authenticationExpired = () =>({
	type: AUTHENTICATION_EXPIRED
});

export const redirectToLoginPageComplete = () =>({
	type: REDIRECT_TO_LOGIN_COMPLETE
});

export const getOrganizationsList = () => {
	return {
		types: [
			'',
			GET_ORGANIZATION_LIST_SUCCESS,
			GET_ORGANIZATION_LIST_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/organization`, {
			method: 'get',
			headers
		})
	};
};

export const getProjectListByOrgId = (org_id) => {
	return {
		types: [
			'',
			GET_PROJECT_LIST_BY_ORG_ID_SUCCESS,
			GET_PROJECT_LIST_BY_ORG_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/project?org_id=${org_id}`, {
			method: 'get',
			headers
		})
	};
};

export const defaultOrgId = (org_id) => {
	return {
		types: [
			'',
			GET_PROJECT_LIST_BY_ORGANAISATION_ID_SUCCESS,
			GET_PROJECT_LIST_BY_ORGANAISATION_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/project?org_id=${org_id}`, {
			method: 'get',
			headers
		})
	};
};

export const updateSelectedOrganization = (org) => {
	return {
		type: SWITCH_ORG_SUCCESS,
		org
	};
};

export const updateSelectedProject = (project) => {
	return {
		type: SWITCH_PROJECT_SUCCESS,
		project
	};
};


export const ifSelectOrgDropdown = show =>{;
	
	return{
		type: CHANGE_ORG_DROPDOWN,
	show

	}
	
	
};