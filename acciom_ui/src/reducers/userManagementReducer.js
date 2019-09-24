import { 
	GET_ORGANIZATION_USER_LIST_SUCCESS,
	GET_ORGANIZATION_USER_LIST_ADD, 
	GET_ROLES_BY_ORG_ID_SUCCESS, 
	GET_ROLES_BY_PROJECT_ID_SUCCESS,
	RETRIVE_USER_ROLE_SUCCESS,
	UPDATE_USER_ROLES_SUCCESS,
	DELETE_USERS_FROM_TABLE,
	ADD_USER_ROLES_SUCCESS

} from '../constants/ActionTypes';

export const roleTypes = {
	ORGANIZATION:'ORGANIZATION',
	PROJECT: 'PROJECT',
	NEW: 'NEW' 
};

const initialState = {
	orgUserList: [],
	orgProjectRolesList: {},
	userOrgRoleList: [],
	userProjectRoleList: [],
	userNewRoleList: [],
	selectedUser: null,
	redirectToUserMgmtHome: false
};

const userManagementData = (state = initialState, action) => {
	switch (action.type) {
	case GET_ORGANIZATION_USER_LIST_SUCCESS:
	
		return {
			...state,
			orgUserList: action.response.data.users,
			userOrgRoleList: [],
			userProjectRoleList: [],
			userNewRoleList: [],
			selectedUser: null,
			redirectToUserMgmtHome: false
		};
		case DELETE_USERS_FROM_TABLE:
				
			const upDatedArray = state.orgUserList.filter(result=>result.user_id !==action.value);
			
			return{
				...state,
				orgUserList:upDatedArray
			}
			case ADD_USER_ROLES_SUCCESS:
				

				
				
				return{
					...state,
					orgUserList:state.orgUserList
				}


		
	case GET_ROLES_BY_ORG_ID_SUCCESS:
	case GET_ROLES_BY_PROJECT_ID_SUCCESS:
		let orgProjectRolesList = { ...state.orgProjectRolesList };
		orgProjectRolesList[action.args.key] = action.response.data.roles;
		return {
			...state,
			orgProjectRolesList
		};

	case RETRIVE_USER_ROLE_SUCCESS:
		return {
			...state,
			userOrgRoleList: action.response.data.org_allowed_role_list ? action.response.data.org_allowed_role_list: [],
			userProjectRoleList: action.response.data.project_role_list ? action.response.data.project_role_list: [],
			userNewRoleList: [],
			selectedUser: action.response.data ? action.response.data: {}
		};
		
	case UPDATE_USER_ROLES_SUCCESS:
		return {
			...state,
			redirectToUserMgmtHome: true
		};
		
	default:
		return state;
	}
};

export default userManagementData;

