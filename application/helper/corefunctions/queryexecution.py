

from application.common.constants import  ExecutionStatus


def query_exectuion(query, db_cursor, export=False):
    """
    executes the give query in the give db connection
    Args:
        query (str)
        db_cursor (db_connection)
        export (boolean): export or not
    Returns:
        payload (dict): execution status and result
    """
    try:
        if export:
            payload = {'res': 1, 'query_result':"done"}
        else:
            if not str(query).find('limit'):
               str(query).replace(';','limit 10;')
            result_list = list()
            db_cursor.execute(query)
            for row in db_cursor:
                for each_row in row:
                    result_list.append(each_row)
            execution_status = ExecutionStatus().\
                get_execution_status_id_by_name('pass')
            payload= {"res": execution_status,"query_result":result_list}

    except Exception as e:
        execution_status = ExecutionStatus(). \
            get_execution_status_id_by_name('error')
        payload = {"res": execution_status,
                   "query_result": {"error_log": str(e)}}

    return payload
