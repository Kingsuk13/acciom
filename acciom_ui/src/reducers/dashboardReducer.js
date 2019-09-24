import {
	GET_ORG_DATA_QUALITY_SUCCESS,
	GET_DQI_PROJECT_DETAILS_SUCCESS,
	GET_PROJECT_LIST_BY_ORG_ID_SUCCESS,
	GET_DQI_HISTORY_DETAILS_SUCCESS,
	SWITCH_PROJECT_SUCCESS
} from '../constants/ActionTypes';


const initialState = {
	orgDataQuality: null,
	projectDataQuality: null,
	refreshDashBoard: false,
	projectDataHistory:{}
};

const dashboardData = (state = initialState, action) => {
	switch (action.type) {
	case SWITCH_PROJECT_SUCCESS:
	case GET_PROJECT_LIST_BY_ORG_ID_SUCCESS:
		return {
			...state,
			refreshDashBoard: true
		};

	case GET_ORG_DATA_QUALITY_SUCCESS:
		return {
			...state,
			orgDataQuality: action.response.data,
			refreshDashBoard: false
		};

	case GET_DQI_PROJECT_DETAILS_SUCCESS:
		return {
			...state,
			projectDataQuality: action.response.data,
			
		};

	case GET_DQI_HISTORY_DETAILS_SUCCESS:
		return {
			...state,
			projectDataHistory: action.response.data.dqi_history,
			

		};	
	
	default:
		return state;
	}
};

export default dashboardData;