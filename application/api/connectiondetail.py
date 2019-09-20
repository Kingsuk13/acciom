from flask_restful import Resource, reqparse

from application.common.api_permission import SELECT_CONNECTION_POST, \
    DB_CONNECTION_GET, CASE_DETAILS_GET
from application.common.common_exception import ResourceNotAvailableException
from application.common.constants import APIMessages
from application.common.response import (api_response, STATUS_CREATED,
                                         STATUS_BAD_REQUEST)
from application.common.token import (token_required)
from application.helper.connectiondetails import (select_connection,
                                                  get_db_connection,
                                                  get_case_detail)
from application.helper.permission_check import check_permission
from application.model.models import (Project, TestSuite, TestCase, User)


class SelectConnection(Resource):
    """
    class to select a connection
    """

    @token_required
    def post(self, session):
        """
        Method will allow user to select connection for particular user
        Args:
            session (Obj): gives user_id of the user

        Returns:will allow user to select connection for particular user
        """
        parser = reqparse.RequestParser()
        parser.add_argument('connection_reference',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        parser.add_argument('case_id_list',
                            type=list, location="json",
                            help=APIMessages.PARSER_MESSAGE)
        parser.add_argument('db_connection_id',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        data = parser.parse_args()
        user = session.user_id
        case_obj = TestCase.query.filter_by(
            test_case_id=data['case_id_list'][0]).first()
        suite_obj = TestSuite.query.filter_by(
            test_suite_id=case_obj.test_suite_id).first()
        project_obj = Project.query.filter_by(
            project_id=suite_obj.project_id).first()
        user_obj = User.query.filter_by(user_id=user).first()
        print(project_obj.org_id, project_obj.project_id)
        check_permission(user_obj, SELECT_CONNECTION_POST,
                         org_id=project_obj.org_id,
                         project_id=project_obj.project_id)
        select_connection(data, user)

        return api_response(True, APIMessages.CONNECTION_SETUP,
                            STATUS_CREATED)


class DbConnection(Resource):
    """
    Class to handle GET API to give all the db_connection_ids
    associated with the project_id.
    """

    @token_required
    def get(self, session):
        """
        Method will give all the db_connection_ids and db connection name.

        Args:
             session (object):By using this object we can get the user_id.

        Returns:
              Standard API Response with message(returns message saying
              that success), data and http status code.
        """
        db_connection_detail = reqparse.RequestParser()
        db_connection_detail.add_argument('project_id', required=True,
                                          type=int,
                                          location='args')
        project_data = db_connection_detail.parse_args()
        project_obj = Project.query.filter(
            Project.project_id == project_data['project_id'],
            Project.is_deleted == False).first()
        if not project_obj:
            raise ResourceNotAvailableException("Project")
        check_permission(session.user, DB_CONNECTION_GET,
                         project_obj.org_id, project_data["project_id"])
        payload = get_db_connection(project_data['project_id'])
        return api_response(True, APIMessages.SUCCESS,
                            STATUS_CREATED, payload)


class CaseDetails(Resource):
    """
    To handle GET API to give all the test case details for a particular suite
    id.

    """

    @token_required
    def get(self, session):
        """
        It returns all the test case details associated with the particular
        suite id provided in the args.

        Args:
             session (object):By using this object we can get the user_id.

        Returns:
              Standard API Response with message(returns message saying
              that success), data and http status code.
        """
        suite_detail = reqparse.RequestParser()
        suite_detail.add_argument('suite_id', required=True,
                                  type=int,
                                  location='args')
        suite_data = suite_detail.parse_args()
        suite_obj = TestSuite.query.filter(
            TestSuite.test_suite_id == suite_data['suite_id'],
            TestSuite.is_deleted == False).first()
        if not suite_obj:
            raise ResourceNotAvailableException("test suite")
        else:
            project_obj = Project.query.filter(
                Project.project_id == suite_obj.project_id,
                Project.is_deleted == False).first()
            if not project_obj:
                return api_response(False,
                                    APIMessages.PROJECT_CONTAIN_SUITE_NOT_EXIST,
                                    STATUS_BAD_REQUEST)
            check_permission(session.user, CASE_DETAILS_GET,
                             project_obj.org_id, suite_obj.project_id)
            payload = get_case_detail(suite_data['suite_id'])
            return api_response(True, APIMessages.SUCCESS,
                                STATUS_CREATED, payload)
