import React, { Component, Fragment } from 'react';
import CommonForm from '../components/commonForm/commonForm';
import {
    ROLEFIELD,
    DESCRIPTIONFIELD,
    ROLENAMEFIELD,
    ROLEDESCFIELD,
    DROPDOWN_POP_UP,
    ADD
} from '../constants/FieldNameConstants';
import { connect } from 'react-redux';
import {
    getAllPermissions,
    createRole,
    getRolesList
} from '../actions/roleManagementActions';
import { toast } from 'react-toastify';
const formatRoleList = permissionsList => {
    let formatedList = [];

    if (permissionsList) {
        formatedList = permissionsList.map(item => {
            return {
                value: item.permission_id,
                label: item.permission_name,
                description: item.permission_description
            };
        });

        return formatedList;
    }
};

class AddRole extends Component {
    state = {
        roleList: [],
        selectedRoles: [],
        textFieldName: '',
        textFieldDesc: ''
    };
    goToBackBtnPage = () => {
        this.props.history.push('/manageRole');
    };
    handleChangeDropdown = event => {
        this.setState({ selectedRoles: event.target.value });
    };
    validateConditions = permissionIdList => {
        const { textFieldName, textFieldDesc } = this.state;
        if (
            textFieldName.length == 0 ||
            textFieldDesc.length == 0 ||
            permissionIdList.length == 0
        ) {
            return true;
        }
        return false;
    };
    saveFunctionality = () => {
        const { textFieldName, textFieldDesc, selectedRoles } = this.state;
        const permissionIdList = selectedRoles.map(item => {
            return item.value;
        });
        const saveFunctionalityDetails = {
            role_name: textFieldName,
            role_description: textFieldDesc,
            org_id: this.props.currentOrg.org_id,
            permission_id_list: permissionIdList
        };
        if (textFieldName.length == 0) {
            toast.error(ROLENAMEFIELD);
        } else {
            if (textFieldDesc.length == 0) {
                toast.error(ROLEDESCFIELD);
            } else {
                if (permissionIdList.length == 0) {
                    toast.error(DROPDOWN_POP_UP);
                }
            }
        }
        if (!this.validateConditions(permissionIdList)) {
            this.props.createRole(JSON.stringify(saveFunctionalityDetails));
        }
    };
    handleTextField = () => {
        if (event.target.name == ROLEFIELD) {
            this.setState({ textFieldName: event.target.value });
        }
        if (event.target.name == DESCRIPTIONFIELD) {
            this.setState({ textFieldDesc: event.target.value });
        }
    };

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.refreshRoleDetails) {
            nextProps.getRolesList(nextProps.currentOrg.org_id);
            nextProps.history.push('/manageRole');
        }

        if (
            nextProps.allPermissionsDetail !== prevState.allPermissionsDetail &&
            prevState.roleList.length == 0
        ) {
            nextProps.getAllPermissions();
            const roleList = formatRoleList(nextProps.allPermissionsDetail);

            return {
                ...prevState,
                roleList
            };
        }
        return {
            ...prevState
        };
    };
    componentWillUnmount() {
        this.setState({
            textFieldName: '',
            textFieldDesc: '',
            selectedRoles: []
        });
    }
    render() {
        const {
            textFieldName,
            textFieldDesc,
            roleList,
            selectedRoles
        } = this.state;
     
        return (
            <Fragment>
                <CommonForm
                    dropdownValue={selectedRoles}
                    roleList={roleList}
                    handleDropdown={event => this.handleChangeDropdown(event)}
                    handleSaveFunctionality={this.saveFunctionality}
                    handleBackButton={this.goToBackBtnPage}
                    handleTextField={this.handleTextField}
                    textFieldName={textFieldName}
                    textFieldDesc={textFieldDesc}
                    variant={ADD}
                />
            </Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        allPermissionsDetail: state.roleManagementData.allPermissionsDetail,
        currentOrg: state.appData.currentOrg,
        refreshRoleDetails: state.roleManagementData.refreshRoleDetails
    };
};
const mapDispatchToProps = dispatch => ({
    getAllPermissions: () => dispatch(getAllPermissions()),
    createRole: data => dispatch(createRole(data)),
    getRolesList: data => dispatch(getRolesList(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddRole);
