from datetime import datetime

from flask import request
from flask_restful import reqparse, Resource

from application.common.api_permission import TEST_SUITE_POST, \
    TEST_SUITE_POST_EXECUTE, TEST_SUITE_PUT, CREATE_NEW_TEST_SUITE_POST, \
    ADD_TEST_SUITE_MANUALLY_POST, TEST_CASE_LOG_DETAIL_GET, \
    EXPORT_TEST_LOG_GET, TEST_CASE_LOG_API_GET
from application.common.common_exception import ResourceNotAvailableException
from application.common.constants import (APIMessages, SupportedTestClass)
from application.common.createdbdetail import create_dbconnection
from application.common.response import (STATUS_CREATED, STATUS_SERVER_ERROR,
                                         STATUS_BAD_REQUEST)
from application.common.response import api_response
from application.common.returnlog import return_all_log
from application.common.runbysuiteid import create_job
from application.common.token import (token_required)
from application.common.utils import return_excel_name_and_project_id
from application.helper.exportTestcaselog import export_test_case_log
from application.helper.permission_check import check_permission
from application.helper.returnallsuites import (return_all_suites,
                                                test_case_details)
from application.helper.runnerclasshelpers import args_as_list
from application.helper.uploadfiledb import save_file_to_db
from application.model.models import (Project, TestCaseLog, TestCase,
                                      TestSuite, User, Organization)
from index import db


class TestSuiteAPI(Resource):
    """
    AddTestSuite Uploads the suite
    """

    @token_required
    def post(self, session):
        """
        Method will add a suite to database

        Args:
            session(Object): contains User_id.

        Returns: Add suite to Database
        """
        parser = reqparse.RequestParser()
        parser.add_argument('sheet_name',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, type=str)
        parser.add_argument('case_id_list',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, type=args_as_list, default=[])
        parser.add_argument('suite_name',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, type=str)
        parser.add_argument('upload_and_execute',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        parser.add_argument('project_id',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        test_suite_data = parser.parse_args()
        current_user = session.user_id
        file = request.files['inputFile']
        user_obj = User.query.filter_by(user_id=current_user).first()
        project_obj = Project.query.filter_by(
            project_id=test_suite_data['project_id'], is_deleted=False).first()
        # check_permission
        check_permission(user_obj,
                         list_of_permissions=TEST_SUITE_POST,
                         org_id=project_obj.org_id,
                         project_id=project_obj.project_id)
        # Check Test Suite name already exist in db or not
        temp_connection = TestSuite.query.filter(
            TestSuite.test_suite_name == test_suite_data[
                "suite_name"],
            TestSuite.project_id == test_suite_data["project_id"]).first()
        if test_suite_data['suite_name'].strip() == '':
            return api_response(False, APIMessages.
                                TEST_SUITE_NAME_CANNOT_BE_BLANK,
                                STATUS_BAD_REQUEST)
        if temp_connection:
            return api_response(False, APIMessages.
                                TEST_SUITE_NAME_ALREADY_PRESENT,
                                STATUS_BAD_REQUEST)

        suite_result = save_file_to_db(current_user,
                                       test_suite_data['project_id'],
                                       test_suite_data, file)
        if int(test_suite_data['upload_and_execute']) == 1:
            test_suite_obj = TestSuite.query.filter_by(
                test_suite_id=int(suite_result['Suite'].test_suite_id)).first()
            project_obj = Project.query.filter_by(
                project_id=test_suite_obj.project_id).first()
            check_permission(user_obj,
                             list_of_permissions=TEST_SUITE_POST_EXECUTE,
                             org_id=project_obj.org_id,
                             project_id=test_suite_obj.project_id)
            create_job(current_user, test_suite_obj, False)
        return api_response(True, APIMessages.ADD_DATA, STATUS_CREATED)

    @token_required
    def get(self, session):
        """
        Method will give suite details, case details  of the user based on the
        token of the user

        Args:
            session(Object): session contains user_id

        Returns: returns suite level details of associated user
        """
        get_project_id_parser = reqparse.RequestParser()
        get_project_id_parser.add_argument('project_id', required=False,
                                           type=int,
                                           location='args')
        project_id = get_project_id_parser.parse_args()
        project_obj = Project.query.filter_by(
            project_id=project_id['project_id']).first()
        if not project_obj:
            return api_response(True, APIMessages.PROJECT_NOT_EXIST,
                                STATUS_SERVER_ERROR)
        else:
            data = {"suites": return_all_suites(project_id['project_id'])}
            return api_response(True, APIMessages.SUCCESS,
                                STATUS_CREATED, data)

    @token_required
    def put(self, session):
        """
        To update the test suite in the database for the user provided
        test case id.

        Args:
            session (object):By using this object we can get the user_id.

        Returns:
             Standard API Response with message(returns message saying
            that test suite updated successfully) and http status code.
        """
        # TODO: Need to use save to db only at the last(after all the fileds)
        put_testcase_parser = reqparse.RequestParser(bundle_errors=True)
        put_testcase_parser.add_argument('test_case_detail', required=True,
                                         type=list, location='json')
        dict_test_case_details = put_testcase_parser.parse_args()
        test_case_detail = dict_test_case_details["test_case_detail"]
        for each_test_case in test_case_detail:
            keys = []
            for key in each_test_case:
                keys.append(key)
            if not "test_case_id" in keys:
                return api_response(False, APIMessages.PASS_TESTCASEID,
                                    STATUS_BAD_REQUEST)
            test_case_id = each_test_case["test_case_id"]
            del each_test_case["test_case_id"]
            test_case_obj = TestCase.query.filter_by(
                test_case_id=test_case_id).first()
            if not test_case_obj:
                return api_response(False,
                                    APIMessages.TEST_CASE_NOT_IN_DB.format(
                                        test_case_id),
                                    STATUS_BAD_REQUEST)
            project_id_org_id = db.session.query(
                Organization.org_id,
                Project.project_id).filter(
                Organization.is_deleted == False).join(
                Project,
                Organization.org_id == Project.org_id).filter(
                Project.is_deleted == False).join(
                TestSuite,
                Project.project_id == TestSuite.project_id).filter(
                TestSuite.test_suite_id == test_case_obj.test_suite_id,
                TestSuite.is_deleted == False
            ).first()
            if project_id_org_id == () or project_id_org_id == None:
                return api_response(False,
                                    APIMessages.NO_TEST_CASE,
                                    STATUS_BAD_REQUEST)
            check_permission(session.user, TEST_SUITE_PUT,
                             project_id_org_id[0],
                             project_id_org_id[1])
            testcasedetail = test_case_obj.test_case_detail
            if "src_db_id" in keys:
                src_db_id = each_test_case["src_db_id"]
                del each_test_case["src_db_id"]
            if "target_db_id" in keys:
                target_db_id = each_test_case["target_db_id"]
                del each_test_case["target_db_id"]
            for key, value in dict(each_test_case).items():
                each_test_case[key] = value.strip()
            if "src_db_id" in keys:
                testcasedetail["src_db_id"] = src_db_id
                test_case_obj.save_to_db()
            if "target_db_id" in keys:
                testcasedetail["target_db_id"] = target_db_id
                test_case_obj.save_to_db()
            if "test_class" in keys:
                if SupportedTestClass(). \
                        get_test_class_id_by_name \
                            (each_test_case["test_class"]) is None:
                    return api_response(success=False,
                                        message=APIMessages.TEST_CLASS_NAME,
                                        http_status_code=STATUS_BAD_REQUEST,
                                        data={})
                test_case_obj.test_case_class = SupportedTestClass(). \
                    get_test_class_id_by_name \
                    (each_test_case["test_class"])
                test_case_obj.save_to_db()
            if "test_description" in keys:
                testcasedetail["test_desc"] = \
                    each_test_case["test_description"]
                test_case_obj.save_to_db()
            if "src_table" in keys:
                table = testcasedetail["table"]
                for key in table:
                    target_table = table[key]
                table[each_test_case["src_table"]] = key
                del table[key]
                table[
                    each_test_case[
                        "src_table"]] = target_table
                test_case_obj.save_to_db()
            if "target_table" in keys:
                table = testcasedetail["table"]
                for key in table:
                    table[key] = each_test_case[
                        "target_table"]
                test_case_obj.save_to_db()
            if "src_qry" in keys:
                queries = testcasedetail["query"]
                queries["sourceqry"] = each_test_case[
                    "src_qry"]
                test_case_obj.save_to_db()
            if "target_qry" in keys:
                queries = testcasedetail["query"]
                queries["targetqry"] = each_test_case[
                    "target_qry"]
                test_case_obj.save_to_db()
            if "column" in keys:
                column = testcasedetail["column"]
                testcasedetail["column"] = column
                if each_test_case["column"] == "":
                    column = {}
                    testcasedetail["column"] = column
                elif ";" and ":" in each_test_case[
                    "column"]:
                    column = {}
                    user_columns = each_test_case[
                        "column"].split(
                        ";")
                    for columnpair in user_columns:
                        if ":" in columnpair:
                            singlecolumn = columnpair.split(
                                ":")
                            column[singlecolumn[0]] = \
                                singlecolumn[1]
                        else:
                            column[columnpair] = columnpair
                    testcasedetail["column"] = column
                elif ";" in each_test_case["column"]:
                    column = {}
                    columns = each_test_case[
                        "column"].split(";")
                    for singlecolumn in columns:
                        column[singlecolumn] = singlecolumn
                    testcasedetail["column"] = column
                else:
                    column = {}
                    column[each_test_case["column"]] = \
                        each_test_case["column"]
                    testcasedetail["column"] = column
                test_case_obj.save_to_db()

            test_case_obj.test_case_detail = testcasedetail
            test_case_obj.save_to_db()
        return api_response(
            True, APIMessages.TEST_SUITE_UPDATED.format(
                test_case_id), STATUS_CREATED)


class CreateNewTestSuite(Resource):
    """ To handle POST API to create a new test suite."""

    @token_required
    def post(self, session):
        """
            To create a new test suite from the given test case list.

             Args:
                 session (object):By using this object we can get the user_id.

             Returns:
                 Standard API Response with message(returns message saying
                 that New Test Suite created),http status code.
        """
        parser = reqparse.RequestParser()
        parser.add_argument('case_id_list',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, type=list, location='json')
        parser.add_argument('suite_name',
                            help=APIMessages.PARSER_MESSAGE,
                            required=False, type=str, location='json')
        test_suite_data = parser.parse_args()
        current_user = session.user_id
        # checking whether test cases passed by user are present in db or not
        for each_test_case_id in test_suite_data["case_id_list"]:
            test_case = TestCase.query.filter(
                TestCase.test_case_id == each_test_case_id,
                TestCase.is_deleted == False).first()
            if not test_case:
                return api_response(False, APIMessages.TEST_CASE_ABSENT,
                                    STATUS_BAD_REQUEST)
        project_id_org_id = db.session.query(
            Organization.org_id,
            Project.project_id).filter(Organization.is_deleted == False).join(
            Project,
            Organization.org_id == Project.org_id).filter(
            Project.is_deleted == False).join(
            TestSuite,
            Project.project_id == TestSuite.project_id).filter(
            TestSuite.test_suite_id == test_case.test_suite_id,
            TestSuite.is_deleted == False
        ).first()
        if project_id_org_id == () or project_id_org_id == None:
            return api_response(False,
                                APIMessages.NO_TEST_CASE,
                                STATUS_BAD_REQUEST)
        check_permission(session.user, CREATE_NEW_TEST_SUITE_POST,
                         project_id_org_id[0],
                         project_id_org_id[1])
        get_excel_name_and_project_id = return_excel_name_and_project_id(
            test_suite_data["case_id_list"][0])
        # check whether test suite present in db or not
        if get_excel_name_and_project_id["user"][0]["test_suite_id"] == []:
            return api_response(False, APIMessages.TEST_SUITE_ABSENT,
                                STATUS_BAD_REQUEST)
        project_id = \
            get_excel_name_and_project_id["user"][0]["test_suite_id"][0][
                "project_id"]
        excel_name = \
            get_excel_name_and_project_id["user"][0]["test_suite_id"][0][
                "excel_name"]

        if test_suite_data["suite_name"] == None or test_suite_data[
            "suite_name"] == " ":
            now = datetime.now()
            date_time_now = now.strftime("%d/%m/%Y %H:%M:%S")
            test_suite_data[
                "suite_name"] = APIMessages.QUALITY_SUITE + date_time_now
            new_test_suite = TestSuite(project_id=project_id,
                                       owner_id=current_user,
                                       excel_name=excel_name,
                                       test_suite_name=test_suite_data[
                                           "suite_name"])
            new_test_suite.save_to_db()
            for each_test_case_id in test_suite_data["case_id_list"]:
                test_case = TestCase.query.filter_by(
                    test_case_id=each_test_case_id).first()
                new_test_case = TestCase(
                    test_suite_id=new_test_suite.test_suite_id,
                    owner_id=current_user,
                    test_case_class=test_case.test_case_class,
                    test_case_detail=test_case.test_case_detail)
                new_test_case.save_to_db()
            return api_response(True, APIMessages.NEW_TEST_SUITE_CREATED,
                                STATUS_CREATED)
        else:
            # Check Test Suite name already exist in db or not
            test_suite_data["suite_name"] = test_suite_data[
                "suite_name"].strip()
            temp_connection = TestSuite.query.filter(
                TestSuite.test_suite_name == test_suite_data[
                    "suite_name"],
                TestSuite.project_id == project_id,
                TestSuite.is_deleted == False).first()
            if temp_connection:
                return api_response(False, APIMessages.
                                    TEST_SUITE_NAME_ALREADY_PRESENT,
                                    STATUS_BAD_REQUEST)
            new_test_suite = TestSuite(project_id=project_id,
                                       owner_id=current_user,
                                       excel_name=excel_name,
                                       test_suite_name=test_suite_data[
                                           "suite_name"])
            new_test_suite.save_to_db()
            for each_test_case_id in test_suite_data["case_id_list"]:
                test_case = TestCase.query.filter_by(
                    test_case_id=each_test_case_id).first()
                new_test_case = TestCase(
                    test_suite_id=new_test_suite.test_suite_id,
                    owner_id=current_user,
                    test_case_class=test_case.test_case_class,
                    test_case_detail=test_case.test_case_detail)
                new_test_case.save_to_db()
            return api_response(True, APIMessages.NEW_TEST_SUITE_CREATED,
                                STATUS_CREATED)


class AddTestSuiteManually(Resource):
    """ To add a test suite manually by a user."""

    @token_required
    def post(self, session):
        """
        It handles a POST API to add new test suite into database.

       Args:
            session (object):By using this object we can get the user_id.

        Returns:
            Standard API Response with message(returns message saying
            that test suite added successfully) and http status code.
        """
        test_suite_parser = reqparse.RequestParser()
        test_suite_parser.add_argument('suite_name',
                                       help=APIMessages.PARSER_MESSAGE,
                                       required=True, type=str)
        test_suite_parser.add_argument('project_id',
                                       help=APIMessages.PARSER_MESSAGE,
                                       required=True, type=int)
        test_suite_parser.add_argument('test_case_detail',
                                       help=APIMessages.PARSER_MESSAGE,
                                       required=True, type=list,
                                       location='json')
        test_suite_data = test_suite_parser.parse_args()
        project_obj = Project.query.filter(
            Project.project_id == test_suite_data["project_id"],
            Project.is_deleted == False).first()
        if not project_obj:
            return api_response(False, APIMessages.PROJECT_NOT_EXIST,
                                STATUS_BAD_REQUEST)
        check_permission(session.user, ADD_TEST_SUITE_MANUALLY_POST,
                         project_obj.org_id, test_suite_data["project_id"])
        # Check Test Suite name already exist in db or not
        test_suite_data["suite_name"] = test_suite_data[
            "suite_name"].strip()
        temp_connection = TestSuite.query.filter(
            TestSuite.test_suite_name == test_suite_data[
                "suite_name"],
            TestSuite.project_id == test_suite_data["project_id"],
            TestSuite.is_deleted == False).first()
        if temp_connection:
            return api_response(False, APIMessages.
                                TEST_SUITE_NAME_ALREADY_PRESENT,
                                STATUS_BAD_REQUEST)
        test_suite = TestSuite(project_id=test_suite_data["project_id"],
                               owner_id=session.user_id,
                               excel_name=None,
                               test_suite_name=test_suite_data[
                                   'suite_name'])
        test_suite.save_to_db()
        for each_test_case in test_suite_data['test_case_detail']:
            keys = []
            for key in each_test_case:
                keys.append(key)
            if "source_db_existing_connection" in keys:
                source_db_existing_connection = each_test_case[
                    "source_db_existing_connection"]
                del each_test_case[
                    "source_db_existing_connection"]
            if "target_db_existing_connection" in keys:
                target_db_existing_connection = each_test_case[
                    "target_db_existing_connection"]
                del each_test_case[
                    "target_db_existing_connection"]
            for key, value in dict(each_test_case).items():
                each_test_case[key] = value.strip()
            if "source_db_existing_connection" not in keys:
                src_db_id = create_dbconnection(session.user_id,
                                                each_test_case[
                                                    'source_db_type'].lower(),
                                                each_test_case[
                                                    'source_db_name'],
                                                each_test_case[
                                                    'source_db_server'].lower(),
                                                each_test_case[
                                                    'source_db_username'],
                                                test_suite_data[
                                                    "project_id"])
            else:
                src_db_id = source_db_existing_connection
            if "target_db_existing_connection" not in keys:
                target_db_id = create_dbconnection(session.user_id,
                                                   each_test_case[
                                                       'target_db_type'].lower(),
                                                   each_test_case[
                                                       'target_db_name'],
                                                   each_test_case[
                                                       'target_db_server'].lower(),
                                                   each_test_case[
                                                       'target_db_username'],
                                                   test_suite_data[
                                                       "project_id"])
            else:
                target_db_id = target_db_existing_connection
            table = {}
            table[each_test_case["source_table"]] = each_test_case[
                "target_table"]
            if "column" not in keys:
                column = {}
            else:
                each_test_case["column"] = each_test_case[
                    "column"].replace(
                    " ",
                    "")
                if each_test_case["column"] == "":
                    column = {}
                elif ";" and ":" in each_test_case["column"]:
                    column = {}
                    user_columns = each_test_case["column"].split(
                        ";")
                    for columnpair in user_columns:
                        if ":" in columnpair:
                            singlecolumn = columnpair.split(
                                ":")
                            column[singlecolumn[0]] = \
                                singlecolumn[1]
                        else:
                            column[columnpair] = columnpair
                elif ";" in each_test_case["column"]:
                    column = {}
                    columns = each_test_case["column"].split(";")
                    for singlecolumn in columns:
                        column[singlecolumn] = singlecolumn
                else:
                    column = {}
                    column[each_test_case["column"]] = \
                        each_test_case["column"]
            query = {}
            if "source_query" not in keys and "target_query" not in keys:
                query["sourceqry"] = ""
                query["targetqry"] = ""
            elif "source_query" not in keys:
                query["sourceqry"] = ""
                query["targetqry"] = each_test_case["target_query"]
            else:
                query["sourceqry"] = each_test_case["source_query"]
                query["targetqry"] = each_test_case["target_query"]
            jsondict = {"column": column, "table": table, "query": query,
                        "src_db_id": src_db_id,
                        "target_db_id": target_db_id,
                        "test_desc": each_test_case["test_description"]}
            test_case = TestCase(test_suite_id=test_suite.test_suite_id,
                                 owner_id=session.user_id,
                                 test_case_class=SupportedTestClass().
                                 get_test_class_id_by_name(
                                     each_test_case["test_case_class"]),
                                 test_case_detail=jsondict)

            test_case.save_to_db()
        return api_response(True, APIMessages.TEST_SUITE_ADDED,
                            STATUS_CREATED)


class TestCaseLogDetail(Resource):
    @token_required
    def get(self, session):
        """
        Method call will return the log of the Executed case based on its
        test_case_log_id
        Returns: return the log of the case_log_id
        """
        user_id = session.user_id
        test_case_log = reqparse.RequestParser()
        test_case_log.add_argument('test_case_log_id',
                                   required=True,
                                   type=int,
                                   location='args')
        test_case_logid = test_case_log.parse_args()
        test_case_log_obj = TestCaseLog.query.filter_by(
            test_case_log_id=test_case_logid['test_case_log_id']).first()
        if not test_case_log_obj:
            raise ResourceNotAvailableException(
                APIMessages.TESTCASELOGID_NOT_IN_DB.format(
                    test_case_logid['test_case_log_id']))
        user_obj = User.query.filter_by(user_id=user_id).first()
        project_id_org_id = db.session.query(
            Organization.org_id,
            Project.project_id).filter(Organization.is_deleted == False).join(
            Project,
            Organization.org_id == Project.org_id).filter(
            Project.is_deleted == False).join(
            TestSuite,
            Project.project_id == TestSuite.project_id).filter(
            TestSuite.is_deleted == False).join(
            TestCase,
            TestSuite.test_suite_id == TestCase.test_suite_id).filter(
            TestCase.test_case_id == test_case_log_obj.test_case_id,
            TestCase.is_deleted == False).first()
        check_permission(user_obj,
                         list_of_permissions=TEST_CASE_LOG_DETAIL_GET,
                         org_id=project_id_org_id[1],
                         project_id=project_id_org_id[0])
        test_case_log = test_case_log.parse_args()
        log_data = {"test_case_log": return_all_log(
            test_case_log['test_case_log_id']),
            "success": True}
        return api_response(True, APIMessages.SUCCESS,
                            STATUS_CREATED, log_data)


class ExportTestLog(Resource):
    """
    Class to Export log to Excel of the executed case based on the
     test_case_log_id
    """

    @token_required
    def get(self, session):
        """
        Method will Export log to Excel based on the test_case_log_id of the
        executed job
        Returns:  Export log to Excel based on the test_case_log_id of the
        executed job
        """
        user_id = session.user_id
        test_case_log = reqparse.RequestParser()
        test_case_log.add_argument('test_case_log_id',
                                   required=False,
                                   type=int,
                                   location='args')
        test_case_log = test_case_log.parse_args()
        test_case_log_obj = TestCaseLog.query.filter_by(
            test_case_log_id=test_case_log['test_case_log_id']).first()
        if not test_case_log_obj:
            raise ResourceNotAvailableException(
                APIMessages.TESTCASELOGID_NOT_IN_DB.format(
                    test_case_log['test_case_log_id']))
        user_obj = User.query.filter_by(user_id=user_id).first()
        project_id_org_id = db.session.query(
            Organization.org_id,
            Project.project_id).filter(Organization.is_deleted == False).join(
            Project,
            Organization.org_id == Project.org_id).filter(
            Project.is_deleted == False).join(
            TestSuite,
            Project.project_id == TestSuite.project_id).filter(
            TestSuite.is_deleted == False).join(
            TestCase,
            TestSuite.test_suite_id == TestCase.test_suite_id).filter(
            TestCase.test_case_id == test_case_log_obj.test_case_id,
            TestCase.is_deleted == False).first()
        check_permission(user_obj,
                         list_of_permissions=EXPORT_TEST_LOG_GET,
                         org_id=project_id_org_id[1],
                         project_id=project_id_org_id[0])
        return export_test_case_log(test_case_log['test_case_log_id'])


class TestCaseLogAPI(Resource):
    @token_required
    def get(self, session):
        user_id = session.user_id
        test_case_detail = reqparse.RequestParser()
        test_case_detail.add_argument('test_case_id',
                                      required=False,
                                      type=int,
                                      location='args')
        test_case_detail = test_case_detail.parse_args()
        case_obj = TestCase.query.filter_by(
            test_case_id=test_case_detail['test_case_id']).first()
        if not case_obj:
            raise ResourceNotAvailableException(
                APIMessages.TEST_CASE_NOT_IN_DB.format(
                    test_case_detail['test_case_id']))
        user_obj = User.query.filter_by(user_id=user_id).first()
        suite_obj = TestSuite.query.filter_by(
            test_suite_id=case_obj.test_suite_id).first()
        project_obj = Project.query.filter_by(
            project_id=suite_obj.project_id).first()
        check_permission(user_obj,
                         list_of_permissions=TEST_CASE_LOG_API_GET,
                         org_id=project_obj.org_id,
                         project_id=project_obj.project_id)
        return test_case_details(test_case_detail['test_case_id'])
