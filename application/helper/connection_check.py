import cx_Oracle
import psycopg2
import pymysql
import pyodbc

from application.common.constants import APIMessages, SupportedDBType, \
    GenericStrings


def connection_check(db_type_id, db_hostname, db_username, db_password,
                     db_name):
    """
    Helper method to check the database connectivity for the given database
    details.

    Args:
        db_type_id(int): type of the database
        db_hostname(str): database hostname
        db_username(str): database username
        db_password(str): database password
        db_name(str): database name
    Returns(str):
        Returns success only if connection can be establish
    """
    # cnxn is a connection object
    if db_type_id == SupportedDBType().get_db_id_by_name("mysql"):
        try:
            cnxn = pymysql.connect(host=db_hostname, user=db_username,
                                   password=db_password, db=db_name)
        except pymysql.err.InternalError as e:
            if GenericStrings.UNKNOWN_DATABASE_MYSQL in e.args[1]:
                return APIMessages.UNKNOWN_DATABASE.format(db_name)
            elif GenericStrings.CANNOT_CONNECT_TO_REMOTE_SERVER_MYSQL in \
                    e.args[1]:
                return APIMessages.CANNOT_CONNECT_TO_REMOTE_SERVER_MYSQL
            else:
                return e.args[1]
        except pymysql.err.OperationalError as e:
            if GenericStrings.AUTHENTICATION_FAILED_MYSQL in e.args[1]:
                return APIMessages.AUTHENTICATION_FAILED.format(db_username)
            elif GenericStrings.CANNOT_CONNECT_TO_SERVER_MYSQL in e.args[1]:
                return APIMessages.CANNOT_CONNECT_TO_SERVER.format(
                    SupportedDBType().get_db_name_by_id(db_type_id),
                    db_hostname)
            else:
                return e.args[1]
        cursor = cnxn.cursor()
        if cursor:
            return APIMessages.SUCCESS
    elif db_type_id == SupportedDBType().get_db_id_by_name("mssql"):
        server = db_hostname
        database = db_name
        username = db_username
        password = db_password
        # This code can handle Oracle Driver 17
        # If other version 13 is given, code will fail
        # TODO: Need to implement an approach that takes driver version
        #  based on user input
        try:
            cnxn = pyodbc.connect(
                'DRIVER={0}'.format(GenericStrings.ORACLE_DRIVER) +
                ';SERVER=' + server +
                ';DATABASE=' + database +
                ';UID=' + username + ';PWD=' + password)
        except pyodbc.ProgrammingError as e:
            return APIMessages.UNKNOWN_DATABASE.format(db_name)
        except pyodbc.InterfaceError as e:
            return APIMessages.AUTHENTICATION_FAILED.format(db_username)
        except pyodbc.OperationalError as e:
            return APIMessages.CANNOT_CONNECT_TO_SERVER.format(
                SupportedDBType().get_db_name_by_id(db_type_id),
                db_hostname)
        cursor = cnxn.cursor()
        if cursor:
            return APIMessages.SUCCESS
    elif db_type_id == SupportedDBType().get_db_id_by_name("postgresql"):
        try:
            cnxn = psycopg2.connect(host=db_hostname, database=db_name,
                                    user=db_username,
                                    password=db_password)
        except psycopg2.OperationalError as e:
            if GenericStrings.UNKNOWN_DATABASE_POSTGRES in str(e):
                return APIMessages.UNKNOWN_DATABASE.format(db_name)
            elif GenericStrings.AUTHENTICATION_FAILED_POSTGRES in str(e):
                return APIMessages.AUTHENTICATION_FAILED.format(db_username)
            elif GenericStrings.CANNOT_CONNECT_TO_SERVER_POSTGRES in str(e):
                return APIMessages.CANNOT_CONNECT_TO_SERVER.format(
                    SupportedDBType().get_db_name_by_id(db_type_id),
                    db_hostname)
            else:
                return e
        cursor = cnxn.cursor()
        if cursor:
            return APIMessages.SUCCESS
    elif db_type_id == SupportedDBType().get_db_id_by_name("oracle"):
        try:
            cnxn = cx_Oracle.connect(
                "{0}/{1}@{2}/{3}".format(db_username, db_password, db_hostname,
                                         db_name))
        except cx_Oracle.DatabaseError as e:
            if GenericStrings.UNKNOWN_DB_AUTHENTICATION_FAILED_ORACLE in str(
                    e):
                return APIMessages.UNKNOWN_DB_AUTHENTICATION_FAILED.format(
                    db_name, db_username)
            elif GenericStrings.CANNOT_CONNECT_TO_SERVER_ORACLE in str(
                    e):
                return APIMessages.CANNOT_CONNECT_TO_SERVER.format(
                    SupportedDBType().get_db_name_by_id(db_type_id),
                    db_hostname)
            else:
                return e
        cursor = cnxn.cursor()
        if cursor:
            return APIMessages.SUCCESS
