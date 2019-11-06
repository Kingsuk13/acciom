from tempfile import NamedTemporaryFile

from openpyxl import Workbook

from application.common.constants import APIMessages
from application.common.constants import ExecutionStatus


def query_exectuion(query, db_cursor):
    """
    executes the give query in the give db connection
    Args:
        query (str)
        db_cursor (db_connection)
        export (boolean): export or not
    Returns:
        payload (dict): execution status and result
    """
    if not ';' in query:
        query = str(query) + ';'
    db_cursor_type = str(db_cursor)

    if "pymysql" in db_cursor_type and not 'limit' in query:
        query = str(query).replace(';', APIMessages.LIMIT_TEN)
    elif "pyodbc" in db_cursor_type and not 'top' in query:
        index = query.index("select") + len("select")
        query = query[:index] + APIMessages.TOP_TEN + query[index:]
    else:
        query = str(query).replace(';', APIMessages.LIMIT_TEN)

    result_list = list()
    db_cursor.execute(query)
    column = []
    for each_row in db_cursor.description:
        column.append(each_row[0])

    for each_rows in db_cursor:
        each_row = []
        for each_element in each_rows:
            each_row.append(str(each_element))
        result_list.append(each_row)
    result_list.insert(0, column)
    execution_status = ExecutionStatus(). \
        get_execution_status_id_by_name('pass')
    payload = {"res": execution_status, "query_result": result_list}

    return payload


def query_exectuion_export(query, db_cursor, query_obj):
    if not ';' in query:
        query = str(query) + ';'
    db_cursor_type = str(db_cursor)

    if "pymysql" in db_cursor_type and not 'limit' in query:
        query = str(query).replace(';', APIMessages.LIMIT_TENTHOUSAND)
    elif "pyodbc" in db_cursor_type and not 'top' in query:
        index = query.index("select") + len("select")
        query = query[:index] + APIMessages.TOP_TENTHOUSAND + query[index:]
    else:
        query = str(query).replace(';', APIMessages.LIMIT_TENTHOUSAND)

    result_list = list()
    db_cursor.execute(query)
    column = []
    for each_row in db_cursor.description:
        column.append(each_row[0])

    for each_rows in db_cursor:
        each_row = []
        for each_element in each_rows:
            each_row.append(str(each_element))
        result_list.append(each_row)
    result_list.insert(0, column)

    execution_status = ExecutionStatus(). \
        get_execution_status_id_by_name('pass')
    query_obj.execution_status = execution_status
    query_obj.save_to_db()

    work_book = Workbook()
    work_sheet = work_book.active

    for each in result_list:
        work_sheet.append(list(each))

    with NamedTemporaryFile(delete=False) as tmp_file:
        work_book.save(tmp_file.name)
        tmp_file.seek(0)
        stream = tmp_file.read()
    return stream
