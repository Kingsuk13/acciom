from flask_restful import Resource, reqparse

from application.common.constants import (APIMessages, ExecutionStatus)
from application.common.response import (STATUS_CREATED, STATUS_OK,
                                         STATUS_BAD_REQUEST)
from application.common.response import api_response
from application.common.token import (token_required)
from application.helper.permission_check import check_permission
from application.model.models import (DbConnection, Project, Query)
from flask_celery import run_quer_analyser_by_id


class QueryAnalyser(Resource):
    """
    QueryAnalyser Executes the manual query provided by the user
    """

    @token_required
    def post(self, session):
        """
        Executes the manual query provided by the user
        returns Success response on Execution or error log
        in case of a error

        Args:
            session(Object): session gives user ID of the owner
            who is execution the job

        Returns: Return api response ,either successful job run or error.
        """
        user_id = session.user_id
        query_parser = reqparse.RequestParser()
        query_parser.add_argument('project_id', type=int, required=True,
                                  location='json',
                                  help=APIMessages.PARSER_MESSAGE, )
        query_parser.add_argument('connection_id', type=int, required=True,
                                  location='json',
                                  help=APIMessages.PARSER_MESSAGE, )
        query_parser.add_argument('query', type=str, required=True,
                                  location='json',
                                  help=APIMessages.PARSER_MESSAGE, )
        query_data = query_parser.parse_args()
        project_obj = Project.query.filter_by(
            project_id=query_data['project_id']).first()
        if not project_obj:
            return api_response(False,
                                APIMessages.NO_RESOURCE.format('Project'),
                                STATUS_BAD_REQUEST)
        db_connection = DbConnection.query.filter(
            DbConnection.db_connection_id == query_data['connection_id'],
            DbConnection.project_id == query_data['project_id']).first()
        if not db_connection:
            return api_response(False, APIMessages.WRONG_DB_CONNECTION,
                                STATUS_BAD_REQUEST)
        check_permission(session.user, list_of_permissions=["execute"],
                         org_id=project_obj.org_id,
                         project_id=project_obj.project_id)
        query_obj = Query(project_id=project_obj.project_id,
                          query_string=query_data['query'],
                          db_connection_id=query_data['connection_id'],
                          owner_id=user_id,
                          execution_status=ExecutionStatus().
                          get_execution_status_id_by_name('new'))
        query_obj.save_to_db()
        query_data = {"query_id": query_obj.query_id,
                      "query": query_obj.query_string,
                      "execution_status": query_obj.execution_status}
        run_quer_analyser_by_id.delay(query_obj.query_id, user_id)
        return api_response(True, APIMessages.JOB_SUBMIT,
                            STATUS_CREATED, query_data)

    @token_required
    def get(self, session):
        """
        Returns the list of queries for the give project

        Args:
            project_id (int): project_id of the project for which queries to be
             returned

        Returns: Return api response and queries.
        """
        query_parser = reqparse.RequestParser()
        query_parser.add_argument('project_id', type=int, required=True,
                                  help=APIMessages.PARSER_MESSAGE,
                                  location='args')
        query_data = query_parser.parse_args()
        project_obj = Project.query.filter_by(
            project_id=query_data['project_id']).first()
        if not project_obj:
            return api_response(False,
                                APIMessages.NO_RESOURCE.format('Project'),
                                STATUS_BAD_REQUEST)
        query_obj_list = Query.query.filter_by(
            project_id=query_data['project_id']).all()
        query_list = list()
        for query_obj in query_obj_list:
            query_list.append(
                {'query_id': query_obj.query_id,
                 'query_string': query_obj.query_string,
                 'project_id': query_obj.project_id,
                 'execution_status': query_obj.execution_status,
                 'db_connection_id': query_obj.db_connection_id,
                 'owner_id': query_obj.owner_id,
                 'is_deleted': query_obj.is_deleted
                 })
        return api_response(True, APIMessages.SUCCESS, STATUS_OK,
                            {'queries': query_list})


class QueryExporter(Resource):
    """
    Execute the query and Exports the data for the given Query.
    """

    @token_required
    def get(self, session):
        """
        To execute and export the data for the given query id.

        Args:
            session: session(Object): session gives user ID of the owner
            who is execution the job

        Returns:
            Returns exported file via socket
        """
        query_parser = reqparse.RequestParser()
        query_parser.add_argument('query_id', type=int, required=True,
                                  help=APIMessages.PARSER_MESSAGE,
                                  location='args')
        query_data = query_parser.parse_args()

        query_obj = Query.query.filter_by(
            query_id=query_data['query_id']).first()
        if not query_obj:
            return api_response(False, APIMessages.WRONG_QUERY_ID,
                                STATUS_BAD_REQUEST)
        project_obj = Project.query.filter_by(
            project_id=query_obj.project_id).first()
        check_permission(session.user, list_of_permissions=["execute"],
                         org_id=project_obj.org_id,
                         project_id=project_obj.project_id)
        run_quer_analyser_by_id(query_obj.query_id,
                                session.user_id,
                                export=True)
