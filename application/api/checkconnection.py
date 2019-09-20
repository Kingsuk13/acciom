"""File to check Database connection."""
from flask_restful import Resource, reqparse

from application.common.constants import APIMessages, SupportedDBType
from application.common.response import (api_response, STATUS_BAD_REQUEST,
                                         STATUS_CREATED)
from application.common.token import token_required
from application.common.utils import validate_empty_fields
from application.helper.connection_check import connection_check


class CheckConnection(Resource):
    """To handle POST method,to check the database connectivity."""

    @token_required
    def post(self, session):
        """
          Method to check database connectivity for the given database.

        Args:
            session (object):By using this object we can get the user_id.

        Returns:
             Standard API Response with message,data( it returns proper message
             either it success or false) and http status code.

        """
        check_connection_parser = reqparse.RequestParser()
        check_connection_parser.add_argument('db_type', required=True,
                                             type=str,
                                             help=APIMessages.PARSER_MESSAGE)
        check_connection_parser.add_argument('db_hostname', required=True,
                                             type=str,
                                             help=APIMessages.PARSER_MESSAGE)
        check_connection_parser.add_argument('db_username', required=True,
                                             type=str,
                                             help=APIMessages.PARSER_MESSAGE)
        check_connection_parser.add_argument('db_password', required=True,
                                             type=str,
                                             help=APIMessages.PARSER_MESSAGE)
        check_connection_parser.add_argument('db_name', required=True,
                                             type=str,
                                             help=APIMessages.PARSER_MESSAGE)
        db_data = check_connection_parser.parse_args()
        for key, value in dict(db_data).items():
            db_data[key] = value.strip()
        list_of_args = [arg.name for arg in check_connection_parser.args]
        # Checking if fields are empty
        request_data_validation = validate_empty_fields(db_data,
                                                        list_of_args)
        if request_data_validation:
            return api_response(success=False,
                                message=request_data_validation,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})
        if SupportedDBType().get_db_id_by_name(
                db_data['db_type']) is None:
            return api_response(success=False,
                                message=APIMessages.DB_TYPE_NAME,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})
        # Checking spaces in username and hostname
        if " " in db_data["db_username"] or " " in db_data["db_hostname"]:
            return api_response(False, APIMessages.
                                NO_SPACES,
                                STATUS_BAD_REQUEST)
        result = connection_check(
            SupportedDBType().get_db_id_by_name(db_data['db_type']),
            db_data['db_hostname'],
            db_data['db_username'],
            db_data['db_password'],
            db_data['db_name'])
        if result == APIMessages.SUCCESS:
            return api_response(True, APIMessages.CONNECTION_CREATE,
                                STATUS_CREATED)
        else:
            return api_response(False,
                                APIMessages.CONNECTION_CANNOT_CREATE.format(
                                    result),
                                STATUS_CREATED)
