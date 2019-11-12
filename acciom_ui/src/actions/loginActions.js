import { BASE_URL, headers, updateHeaders } from './appActions';
import {
	LOGIN_TO_PORTAL_SUCCESS,
	LOGIN_TO_PORTAL_ERROR,
	LOGOUT_FROM_PORTAL_SUCCESS,
	LOGOUT_FROM_PORTAL_ERROR,
	CHANGE_PASSWORD_SUCCESS,
	CHANGE_PASSWORD_ERROR,
	FORGET_PASSWORD_SUCCESS,
	FORGET_PASSWORD_ERROR,
	GENERATE_TOKEN_SUCCESS,
	GENERATE_TOKEN_ERROR
} from '../constants/ActionTypes'; 

const base64Encode = (email, password) => {
	return btoa(`${email}:${password}`);
};

export const logoutFromPortalSuccess = () =>({
	type: LOGOUT_FROM_PORTAL_SUCCESS
});

export const clearUserData = () => {
	localStorage.removeItem('auth_token');
	updateHeaders('');
};

export const checkAuthentication = () => {
	let token = localStorage.getItem('auth_token') ;
	token = (token === 'undefined' || token === 'null') ? '' : token;
	return {
		type: LOGIN_TO_PORTAL_SUCCESS,
		response: { data: { token } }
	};
};

export const loginToPortal = ({email, password}) => {
	headers.Authorization = `Basic ` + base64Encode(email, password);
	return {
		types: [
			'',
			LOGIN_TO_PORTAL_SUCCESS,
			LOGIN_TO_PORTAL_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/login`, {
			method: 'post',
			headers
		})
	};
};

export const logoutFromPortal = () => {
	return {
		types: [
			'',
			LOGOUT_FROM_PORTAL_SUCCESS,
			LOGOUT_FROM_PORTAL_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/logout`, {
			method: 'post',
			headers
		})
	};	
};

export const changePassword = (body) => {
	return {
		types: [
			'',
			CHANGE_PASSWORD_SUCCESS,
			CHANGE_PASSWORD_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/change-password`, {
			method: 'post',
			headers,
			body
		})
	};		
};

export const forgetPassword = (body) => {
	return {
		types: [
			'',
			FORGET_PASSWORD_SUCCESS,
			FORGET_PASSWORD_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/generate-token`, {
			method: 'post',
			headers,
			body
		})
	};			
};

export const generateToken = (body) => {
	return {
		types: [
			'',
			GENERATE_TOKEN_SUCCESS,
			GENERATE_TOKEN_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/generate-token`, {
			method: 'post',
			headers,
			body
		})
	};
};