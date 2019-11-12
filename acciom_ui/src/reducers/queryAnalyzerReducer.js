import {
   
    GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS,
    GET_QUERY_ANALYSER_TABLE_DATA_ERROR,
    GET_QUERY_ANALYSER_SINGLE_QUERY_SUCCESS,
    GET_QUERY_ANALYSER_SINGLE_QUERY_ERROR
} from '../constants/ActionTypes';

const initialState = {
projectQueryData:[]
};
const queryAnalyzerData = (state= initialState, action) => {
    switch (action.type) {
        case GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS:
        
            return{
                ...state,
                projectQueryData: action.response.data.queries
            }
            case GET_QUERY_ANALYSER_SINGLE_QUERY_SUCCESS:
        
                return{
                    ...state,
                }
            default:
            return state;
    }

};
export default queryAnalyzerData;