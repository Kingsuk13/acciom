"""File to handle Role API Operations."""
from flask_restful import Resource, reqparse
from sqlalchemy import and_

from application.common.api_permission import ROLE_API_POST, ROLE_API_GET, \
    ROLE_API_PUT, ROLE_API_DELETE
from application.common.common_exception import GenericBadRequestException
from application.common.constants import APIMessages
from application.common.response import (STATUS_CREATED,
                                         STATUS_OK, STATUS_BAD_REQUEST,
                                         STATUS_FORBIDDEN)
from application.common.response import api_response
from application.common.token import token_required
from application.common.utils import validate_empty_fields
from application.helper.permission_check import check_permission
from application.helper.permission_check import check_valid_id_passed_by_user
from application.helper.role_operation import retrieve_roles_under_org, \
    retrive_role_with_permissions_by_role_id
from application.model.models import (Project, Role, Permission,
                                      RolePermission, UserOrgRole,
                                      UserProjectRole)
from index import db


class RoleAPI(Resource):
    """Class to handle Role related GET, POST and PUT APIs."""

    @token_required
    def post(self, session):
        """
        POST call to Create a  role.

        Args:
            session (object): User session

        Returns: Standard API Response with HTTP status code
        """
        create_role_parser = reqparse.RequestParser()
        create_role_parser.add_argument(
            'role_name', help=APIMessages.PARSER_MESSAGE, required=True,
            type=str, location='json')
        create_role_parser.add_argument(
            'role_description', help=APIMessages.PARSER_MESSAGE, required=True,
            type=str, location='json')
        create_role_parser.add_argument(
            'org_id', help=APIMessages.PARSER_MESSAGE, required=True,
            type=int, location='json')
        create_role_parser.add_argument(
            'permission_id_list', help=APIMessages.PARSER_MESSAGE,
            required=True, type=list, location='json')
        create_role_data = create_role_parser.parse_args()
        create_role_data["role_name"] = create_role_data["role_name"].strip()
        create_role_data["role_description"] = create_role_data[
            "role_description"].strip()
        list_of_args = [arg.name for arg in create_role_parser.args]
        request_data_validation = validate_empty_fields(create_role_data,
                                                        list_of_args)
        if request_data_validation:
            return api_response(success=False,
                                message=request_data_validation,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})
        # check if permission_id_list is not empty
        if not create_role_data['permission_id_list']:
            raise GenericBadRequestException(APIMessages.PERMISSION_LIST)
        # TODO: Check User Management access
        permission_id_given_by_user = set(
            create_role_data['permission_id_list'])
        # checking if permissions are valid
        valid_permissions = check_permission_exists(
            permission_id_given_by_user)
        if isinstance(valid_permissions, tuple):
            return api_response(
                False, APIMessages.NO_RESOURCE.format('Permission'),
                STATUS_BAD_REQUEST,
                {'invalid_permissions': list(valid_permissions[0])})
        check_valid_id_passed_by_user(org_id=create_role_data['org_id'])
        # checking if role_name already exists with given org
        get_role_details = Role.query.filter(and_(
            Role.role_name.ilike(create_role_data['role_name']),
            Role.org_id == create_role_data['org_id'])).first()
        if get_role_details:
            raise GenericBadRequestException(
                APIMessages.RESOURCE_EXISTS.format('Role'))
        check_permission(user_object=session.user,
                         list_of_permissions=ROLE_API_POST,
                         org_id=create_role_data["org_id"])
        new_role = Role(
            role_name=create_role_data['role_name'],
            org_id=create_role_data['org_id'],
            owner_id=session.user_id,
            description=create_role_data["role_description"])
        new_role.save_to_db()
        # add permission to role
        for each_permission in set(create_role_data['permission_id_list']):
            add_role_permission = RolePermission(
                org_id=create_role_data['org_id'],
                role_id=new_role.role_id, permission_id=each_permission,
                owner_id=session.user_id)
            add_role_permission.save_to_db()
        payload = {'role_name': new_role.role_name,
                   'role_id': new_role.role_id,
                   'permissions_granted': valid_permissions}
        return api_response(
            True, APIMessages.CREATE_RESOURCE.format('Role'),
            STATUS_CREATED, payload)

    @token_required
    def get(self, session):
        """
        GET call to retrieve role information.

        Args:
            session (object): User session

        Returns: Standard API Response with HTTP status code
        """
        get_role_parser = reqparse.RequestParser()
        get_role_parser.add_argument(
            'org_id', help=APIMessages.PARSER_MESSAGE,
            type=str, location='args')
        get_role_parser.add_argument(
            'project_id', help=APIMessages.PARSER_MESSAGE,
            type=str, location='args')
        get_role_parser.add_argument(
            'role_id', help=APIMessages.PARSER_MESSAGE,
            type=str, location='args')
        get_role_data = get_role_parser.parse_args()
        payload = None
        # Check if either Org Id or Project Id or Role Id is passed
        if not get_role_data['org_id'] and not get_role_data[
            'project_id'] and not get_role_data['role_id']:
            raise GenericBadRequestException(
                APIMessages.ORG_PROJECT_ROLE_REQUIRED)
        if get_role_data['org_id'] and get_role_data['project_id'] and \
                get_role_data['role_id']:
            raise GenericBadRequestException(
                APIMessages.ONLY_ORG_OR_PROJECT_OR_ROLE)
        if get_role_data['org_id'] and get_role_data['project_id']:
            raise GenericBadRequestException(
                APIMessages.ONLY_ORG_OR_PROJECT_OR_ROLE)
        if get_role_data['org_id'] and get_role_data['role_id']:
            raise GenericBadRequestException(
                APIMessages.ONLY_ORG_OR_PROJECT_OR_ROLE)
        if get_role_data['project_id'] and get_role_data['role_id']:
            raise GenericBadRequestException(
                APIMessages.ONLY_ORG_OR_PROJECT_OR_ROLE)
        if get_role_data['org_id'] and not get_role_data['project_id'] and not \
                get_role_data['role_id']:
            # get all roles based on org_id
            # TODO: Returns roles with permission not exceeding the User's
            #  permissions
            check_valid_id_passed_by_user(org_id=get_role_data['org_id'])

            check_permission(user_object=session.user,
                             list_of_permissions=ROLE_API_GET,
                             org_id=get_role_data["org_id"])
            permissions = db.session.query(
                Permission.permission_id).join(
                RolePermission,
                Permission.permission_id == RolePermission.permission_id).join(
                UserOrgRole,
                RolePermission.role_id == UserOrgRole.role_id).filter(
                UserOrgRole.user_id == session.user_id,
                UserOrgRole.org_id == get_role_data["org_id"]).distinct().all()
            permission_id_list = [permission for permission, in permissions]
            payload = retrieve_roles_under_org(get_role_data['org_id'],
                                               permission_id_list)
        if get_role_data['project_id'] and not get_role_data['org_id'] and not \
                get_role_data["role_id"]:
            check_valid_id_passed_by_user(
                project_id=get_role_data['project_id'])

            project_obj = Project.query.filter(
                Project.project_id == get_role_data["project_id"],
                Project.is_deleted == False).first()
            check_permission(user_object=session.user,
                             list_of_permissions=ROLE_API_GET,
                             project_id=get_role_data["project_id"],
                             org_id=project_obj.org_id)
            permissions = db.session.query(
                Permission.permission_id).join(
                RolePermission,
                Permission.permission_id == RolePermission.permission_id).join(
                UserOrgRole,
                RolePermission.role_id == UserOrgRole.role_id).filter(
                UserOrgRole.user_id == session.user_id,
                UserOrgRole.org_id == project_obj.org_id).distinct().all()
            permission_id_list = [permission for permission, in permissions]
            payload = retrieve_roles_under_org(project_obj.org_id,
                                               permission_id_list)
        if get_role_data['role_id'] and not get_role_data['org_id'] and not \
                get_role_data["project_id"]:
            check_valid_id_passed_by_user(role_id=get_role_data['role_id'])
            role_obj = Role.query.filter_by(
                role_id=get_role_data["role_id"]).first()
            check_permission(user_object=session.user,
                             list_of_permissions=ROLE_API_GET,
                             org_id=role_obj.org_id)
            if not (session.user.is_super_admin or
                    UserOrgRole.query.filter(user_id=session.user_id,
                                             org_id=role_obj.org_id).first() or
                    UserProjectRole.query.filter(
                        user_id=session.user_id,
                        org_id=role_obj.org_id).first()):
                return api_response(False, APIMessages.FORBIDDEN,
                                    STATUS_FORBIDDEN)
            payload = retrive_role_with_permissions_by_role_id(
                role_obj)
        if payload:
            return api_response(True, APIMessages.SUCCESS, STATUS_OK,
                                {'roles': payload})
        raise GenericBadRequestException(APIMessages.NO_ROLES)

    @token_required
    def put(self, session):
        """
        PUT call to update role.

        Args:
            session (object): User session

        Returns: Standard API Response with HTTP status code
        """
        create_role_parser = reqparse.RequestParser()
        create_role_parser.add_argument(
            'role_id', help=APIMessages.PARSER_MESSAGE,
            type=str, required=True, location='json')
        create_role_parser.add_argument(
            'role_name', type=str, location='json')
        create_role_parser.add_argument(
            'role_description', type=str, location='json')
        create_role_parser.add_argument(
            'permission_id_list', type=list, location='json')
        create_role_data = create_role_parser.parse_args()
        keys = set()
        for key, value in dict(create_role_data).items():
            if value == None:
                del create_role_data[key]
        for key, value in dict(create_role_data).items():
            keys.add(key)
        role_obj = Role.query.filter(
            Role.role_id == create_role_data["role_id"]).first()
        if "role_name" in keys:
            create_role_data["role_name"] = create_role_data[
                "role_name"].strip()
            # checking if role_name already exists in org
            get_role_details = Role.query.filter(and_(
                Role.role_name.ilike(create_role_data['role_name']),
                Role.org_id == role_obj.org_id,
                Role.role_id != role_obj.role_id)).first()
            if get_role_details:
                raise GenericBadRequestException(
                    APIMessages.RESOURCE_EXISTS.format('Role'))
        if "role_description" in keys:
            create_role_data["role_description"] = create_role_data[
                "role_description"].strip()
        # check if permission_id_list is not empty
        if "permission_id_list" in keys:
            if not create_role_data['permission_id_list']:
                raise GenericBadRequestException(APIMessages.PERMISSION_LIST)
            permission_id_given_by_user = set(
                create_role_data['permission_id_list'])
            # checking if permissions are valid
            valid_permissions = check_permission_exists(
                permission_id_given_by_user)
            if isinstance(valid_permissions, tuple):
                return api_response(
                    False, APIMessages.NO_RESOURCE.format('Permission'),
                    STATUS_BAD_REQUEST,
                    {'invalid_permissions': list(valid_permissions[0])})
        check_permission(user_object=session.user,
                         list_of_permissions=ROLE_API_PUT,
                         org_id=role_obj.org_id)
        role_permission = RolePermission.query.filter(
            RolePermission.org_id == role_obj.org_id,
            RolePermission.role_id == role_obj.role_id,
        ).all()
        permission_id_in_table = set()
        for each_role in role_permission:
            permission_id_in_table.add(each_role.permission_id)
        # role_permission.delete_from_db()
        for key, value in create_role_data.items():
            if key == 'role_name':
                if value == "":
                    return APIMessages.ROLE_NAME_CANNOT_BLANK
                role_obj.role_name = value
            if key == 'role_description':
                if value == "":
                    return APIMessages.ROLE_DESCRIPTION_CANNOT_BLANK
                role_obj.description = value
            if key == 'permission_id_list':
                for each_permission_by_user in value:
                    if each_permission_by_user not in permission_id_in_table:
                        add_role_permission = RolePermission(
                            org_id=role_obj.org_id,
                            role_id=role_obj.role_id,
                            permission_id=each_permission_by_user,
                            owner_id=session.user_id)
                        add_role_permission.save_to_db()
                for each_permission_in_table in permission_id_in_table:
                    if each_permission_in_table not in value:
                        # TODO: Delete the permission which is not given by user
                        role_permission_obj = RolePermission.query.filter_by(
                            org_id=role_obj.org_id, role_id=role_obj.role_id,
                            permission_id=each_permission_in_table).first()
                        role_permission_obj.delete_from_db()
        role_obj.save_to_db()
        return api_response(
            True, APIMessages.ROLE_UPDATED, STATUS_CREATED)

    @token_required
    def delete(self, session):
        """
        To delete the role for the user provided role id.

        Args:
            session (object):By using this object we can get the user_id.

        Returns:
            Standard API Response with message(returns message saying
            that Role Deleted Successfully) and http status code.
        """
        delete_role_parser = reqparse.RequestParser()
        delete_role_parser.add_argument('role_id',
                                        required=True,
                                        type=int,
                                        location='json')
        deletedata = delete_role_parser.parse_args()
        role_obj = Role.query.filter(
            Role.role_id == deletedata["role_id"]).first()
        if not role_obj:
            return api_response(False,
                                APIMessages.NO_RESOURCE.format("Role"),
                                STATUS_BAD_REQUEST)
        check_permission(session.user, ROLE_API_DELETE,
                         role_obj.org_id)
        user_org_role_object = UserOrgRole.query.filter_by(
            user_id=session.user_id, org_id=role_obj.org_id,
            role_id=deletedata["role_id"]).first()
        user_project_role_project = UserProjectRole.query.filter_by(
            user_id=session.user_id, org_id=role_obj.org_id,
            role_id=deletedata["role_id"]).first()
        if user_org_role_object or user_project_role_project:
            return api_response(False,
                                "Role Cannot be deleted",
                                STATUS_BAD_REQUEST)
        RolePermission.query.filter_by(
            org_id=role_obj.org_id,
            role_id=deletedata["role_id"]).delete()
        role_obj.delete_from_db()
        return api_response(
            True, APIMessages.ROLE_DELETED, STATUS_CREATED)


def check_permission_exists(permission_id_given_by_user):
    """
    Check if permission Id exists in DB.

    Args:
        permission_id_given_by_user (set): Set of permission Ids

    Returns: list of permission name if provided permission Ids are valid
    Tuple of invalid permission and permission name in case on invalid
    permission Ids
    """
    # checking if permissions are valid
    check_permission = Permission.query.filter(
        Permission.permission_id.in_(list(permission_id_given_by_user))).all()
    valid_permission_list = \
        [permission.permission_id for permission in check_permission]
    permission_names_list = \
        [permission.permission_name for permission in check_permission]
    if len(valid_permission_list) != len(permission_id_given_by_user):
        invalid_permissions = set(permission_id_given_by_user).difference(
            valid_permission_list)
        return invalid_permissions, permission_names_list
    return permission_names_list
