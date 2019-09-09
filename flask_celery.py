from application.common.constants import (ExecutionStatus, SupportedTestClass)
from application.helper.runnerclass import run_by_case_id
from application.model.models import (TestCase, TestCaseLog)
from index import celery


@celery.task(name='runnerclass.run_by_case_id_dv', queue="Dv_Q")
def run_by_case_id_dv(case_log_id, test_case_id, user_id):
    run_by_case_id(case_log_id, test_case_id, user_id)


@celery.task(name='run_by_case_id_other', queue="other_Q")
def run_by_case_id_other(case_log_id, test_case_id, user_id):
    run_by_case_id(case_log_id, test_case_id, user_id)
    return "others"


@celery.task(name='job_submit', queue="master_Q")
def job_submit(job_id, user_id):
    """
    Method will submit each case associated with the job id in the celery queue
    parralely.
    Args:
        job_id (Int): Job id of the job passed
        user_id (int): User id associated with the executor

    Returns: Status of the jobs

    """

    execution_status_new = ExecutionStatus().get_execution_status_id_by_name(
        'new')
    test_case_log_obj = TestCaseLog.query.filter_by(job_id=job_id).all()
    # # change job status ->
    for each_case in test_case_log_obj:
        case_obj = each_case.test_case_id
        case = TestCase.query.filter_by(test_case_id=case_obj).first()
        if (each_case.execution_status == execution_status_new) and (
                case.test_case_class == SupportedTestClass().get_test_class_id_by_name(
            'datavalidation')):
            run_by_case_id_dv.delay(each_case.test_case_log_id,
                                    each_case.test_case_id,
                                    user_id)
        else:
            run_by_case_id_other.delay(each_case.test_case_log_id,
                                       each_case.test_case_id,
                                       user_id)
