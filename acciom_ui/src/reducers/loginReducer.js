import { 
	LOGIN_TO_PORTAL_SUCCESS,
	LOGIN_TO_PORTAL_ERROR,
	LOGOUT_FROM_PORTAL_SUCCESS,
	LOGOUT_FROM_PORTAL_ERROR,
	CHANGE_PASSWORD_SUCCESS,
	AUTHENTICATION_EXPIRED,
	FORGET_PASSWORD_SUCCESS,
	GENERATE_TOKEN_SUCCESS,
	GENERATE_TOKEN_ERROR
} from '../constants/ActionTypes';

import { updateHeaders } from '../actions/appActions';

const initialState = {
	token: null,
	authTokenExpired: false,
	passwordChanged: false,
	accessToken:''
};

const storeUserData = ({token}) => {
	localStorage.setItem('auth_token', token);
	updateHeaders(token);
};

const loginData = (state = initialState, action) => {
	switch (action.type) {
	case LOGIN_TO_PORTAL_SUCCESS:
		storeUserData(action.response.data);
		if(action.response.data.default_org_id){
		window.sessionStorage.setItem('default_org_id', action.response.data.default_org_id);
		}
		if(action.response.data.default_project_id){
		window.sessionStorage.setItem('default_project_id', action.response.data.default_project_id);
		}
		return {
			...state,
			token : action.response.data.token,
			default_org_id: action.response.data.default_org_id,
        	default_project_id: action.response.data.default_project_id,
			authTokenExpired: false
		};

	case LOGIN_TO_PORTAL_ERROR:
		return {
			...state
		};
	
	case AUTHENTICATION_EXPIRED:
	case LOGOUT_FROM_PORTAL_SUCCESS:
		return {
			...state,
			token: '',
			authTokenExpired: true 
		};

	case LOGOUT_FROM_PORTAL_ERROR:
		return {
			...state
		};

	case CHANGE_PASSWORD_SUCCESS:
		return {
			...state,
			passwordChanged: true
		};
      
	case FORGET_PASSWORD_SUCCESS:
		return {
			...state,
			forgetPasswordChanged: true
		}
	
	case GENERATE_TOKEN_SUCCESS:
		return {
			...state,
			accessToken:action.response.data.personal_access_token
		};

	default:
		return state;
	}
};

export default loginData;

