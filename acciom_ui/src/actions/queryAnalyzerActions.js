import { BASE_URL, headers } from './appActions';
import { 
  
	GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS,
	GET_QUERY_ANALYSER_TABLE_DATA_ERROR,
	GET_QUERY_ANALYSER_SINGLE_QUERY_SUCCESS,
	GET_QUERY_ANALYSER_SINGLE_QUERY_ERROR
	
} from "../constants/ActionTypes";
export const getTableData = (projectId) => {
	
    return {
		types: [
            '',
            GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS,
			GET_QUERY_ANALYSER_TABLE_DATA_ERROR
        ],
        

		callAPI: () => fetch(`${BASE_URL}/query-analyser?project_id=${projectId}`, {
			method: 'get',
            headers
		})
	};
}
export const getSingleQuery = (data) => {

	return{
		types: [
			'',
			GET_QUERY_ANALYSER_SINGLE_QUERY_SUCCESS,
			GET_QUERY_ANALYSER_SINGLE_QUERY_ERROR
		],
		callAPI:()=> fetch(`${BASE_URL}/query-analyser`, {
			method: 'post',
			headers,
			body:data
		})

	}


}