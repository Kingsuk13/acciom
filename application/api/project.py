"""File to handle Project API Operations."""
from flask_restful import Resource, reqparse

from application.common.api_permission import PROJECT_POST, \
    PROJECT_PUT
from application.common.common_exception import GenericBadRequestException
from application.common.constants import APIMessages
from application.common.response import (STATUS_CREATED,
                                         STATUS_OK, STATUS_UNAUTHORIZED,
                                         STATUS_BAD_REQUEST)
from application.common.response import api_response
from application.common.token import token_required
from application.common.utils import validate_empty_fields
from application.helper.permission_check import check_permission
from application.helper.runnerclasshelpers import project_detail
from application.model.models import (Project, UserOrgRole, Organization,
                                      UserProjectRole)


class ProjectAPI(Resource):
    """Class to handle Project related GET, POST and PUT API."""

    @token_required
    def post(self, session):
        """
        Post call to create Project with name and organization Id.

        Args:
            session(object): User session

        Returns: Standard API Response with HTTP status code
        """
        create_project_parser = reqparse.RequestParser(bundle_errors=True)
        create_project_parser.add_argument(
            'project_name',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=str, location='json')
        create_project_parser.add_argument(
            'org_id',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=int, location='json')
        create_project_data = create_project_parser.parse_args()
        org_obj = Organization.query.filter_by(
            org_id=create_project_data['org_id'],
            is_deleted=False).first()
        if not org_obj:
            raise GenericBadRequestException(APIMessages.INVALID_ORG_ID)
        check_permission(user_object=session.user,
                         list_of_permissions=PROJECT_POST,
                         org_id=create_project_data["org_id"])
        create_project_data['project_name'] = create_project_data[
            'project_name'].strip()
        list_of_args = [arg.name for arg in create_project_parser.args]
        request_data_validation = validate_empty_fields(
            create_project_data,
            list_of_args)
        if request_data_validation:
            return api_response(success=False,
                                message=request_data_validation,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})

        new_project = Project(create_project_data['project_name'],
                              create_project_data['org_id'],
                              session.user_id)
        new_project.save_to_db()
        project_payload = {'project_name': new_project.project_name,
                           'project_id': new_project.project_id,
                           'org_id': new_project.org_id}
        return api_response(True,
                            APIMessages.CREATE_RESOURCE.format('Project'),
                            STATUS_CREATED, project_payload)

    @token_required
    def put(self, session):
        """
        PUT call to update project name.

        Args:
            session(object): User session

        Returns: Standard API Response with HTTP status code

        """
        update_project_parser = reqparse.RequestParser(bundle_errors=True)
        update_project_parser.add_argument(
            'project_id', help=APIMessages.PARSER_MESSAGE,
            required=True, type=int)
        update_project_parser.add_argument(
            'project_name',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=str)
        update_project_data = update_project_parser.parse_args()
        current_project = Project.query.filter_by(
            project_id=update_project_data['project_id'],
            is_deleted=False).first()
        if not current_project:
            return api_response(False, APIMessages.PROJECT_NOT_EXIST,
                                STATUS_BAD_REQUEST)
        check_permission(user_object=session.user,
                         list_of_permissions=PROJECT_PUT,
                         project_id=update_project_data["project_id"],
                         org_id=current_project.org_id)
        update_project_data['project_name'] = update_project_data[
            'project_name'].strip()
        list_of_args = [arg.name for arg in update_project_parser.args]
        request_data_validation = validate_empty_fields(
            update_project_data,
            list_of_args)
        if request_data_validation:
            return api_response(success=False,
                                message=request_data_validation,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})
        current_project.project_name = update_project_data['project_name']
        current_project.save_to_db()
        return api_response(True,
                            APIMessages.UPDATE_RESOURCE.format('Project'),
                            STATUS_OK)

    @token_required
    def get(self, session):
        """
        GET call to retrieve project details.

        Args:
            session(object): User session

        Returns: Standard API Response with HTTP status code

        """
        get_project_parser = reqparse.RequestParser()
        get_project_parser.add_argument(
            'org_id', help=APIMessages.PARSER_MESSAGE,
            required=True, type=int, location='args')
        get_project_data = get_project_parser.parse_args()
        # TODO: Check if organization is active and called has access
        user_obj = session.user
        # TODO:Add Check permission
        # check_permission(user_object=session.user,
        #                  list_of_permissions=PROJECT_GET,
        #                  org_id=get_project_data["org_id"])
        # check if user has all org level permissions
        user_org_role = UserOrgRole.query.filter_by(
            user_id=session.user_id,
            org_id=get_project_data['org_id']).first()
        if user_obj.is_super_admin == True or user_org_role:
            # Storing all active projects in a list
            list_of_active_project_obj = Project.query.filter_by(
                org_id=get_project_data['org_id'], is_deleted=False).all()
            if not list_of_active_project_obj:
                return api_response(False,
                                    APIMessages.NO_RESOURCE.format('Project'),
                                    STATUS_UNAUTHORIZED)
            projects_to_return = project_detail(list_of_active_project_obj,
                                                user_org_role)
            return api_response(
                True, APIMessages.SUCCESS, STATUS_OK,
                {"projects_under_organization": projects_to_return})
        else:
            project_obj = UserProjectRole.query.filter(
                UserProjectRole.user_id == session.user_id,
                UserProjectRole.org_id == get_project_data['org_id']).all()
            if not project_obj:
                return api_response(False,
                                    APIMessages.NO_RESOURCE.format('Project'),
                                    STATUS_UNAUTHORIZED)
            active_project = set()
            for each_project in project_obj:
                active_project.add(
                    each_project.project_id)
            list_of_active_project_obj = Project.query.filter(
                Project.project_id.in_(active_project),
                Project.is_deleted == False).all()
            projects_to_return = project_detail(list_of_active_project_obj,
                                                user_org_role)
            return api_response(
                True, APIMessages.SUCCESS, STATUS_OK,
                {"projects_under_organization": projects_to_return})
