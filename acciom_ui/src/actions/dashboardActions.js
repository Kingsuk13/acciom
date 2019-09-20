import _orgDataQuality from '../json/org-data-quality.json';
import _projectDataQuality from '../json/project-data-quality-index.json';

import {
	GET_ORG_DATA_QUALITY_SUCCESS,
	GET_ORG_DATA_QUALITY_ERROR,
	GET_DQI_PROJECT_DETAILS_SUCCESS,
	GET_DQI_PROJECT_DETAILS_ERROR,
	GET_DQI_HISTORY_DETAILS_SUCCESS,
	GET_DQI_HISTORY_DETAILS_ERROR
} from '../constants/ActionTypes';

import { BASE_URL, headers, TIMEOUT } from './appActions';

export const getOrgDataQuality = (orgId) => {
	return {
		types: [
			'',
			GET_ORG_DATA_QUALITY_SUCCESS,
			GET_ORG_DATA_QUALITY_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/organization-data-quality-index?org_id=${orgId}`, {
			method: 'get',
			headers
		})
	};
};

export const getDQIprojectDetails = (project_id) => {
	return {
		types: [
			'',
			GET_DQI_PROJECT_DETAILS_SUCCESS,
			GET_DQI_PROJECT_DETAILS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/project-data-quality-index?project_id=${project_id}`, {
			method: 'get',
			headers
		})
	};

};

export const getHistoryGraphdata = (project_id) => {
	return {
		types: [
			'',
			GET_DQI_HISTORY_DETAILS_SUCCESS,
			GET_DQI_HISTORY_DETAILS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/project-dqi-history?project_id=${project_id}`, {
			method: 'get',
			headers
		})
	};

};