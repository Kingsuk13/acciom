import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    ROLEFIELD,
    DESCRIPTIONFIELD,
    ROLEDESCFIELD,
    ROLENAMEFIELD,
    EDIT
} from '../constants/FieldNameConstants';
import { connect } from 'react-redux';
import {
    getSelectedRole,
    updateRoleList,
    getRolesList,
    resetAllValueOfRole
} from '../actions/roleManagementActions';
import { toast } from 'react-toastify';
import CommonForm from '../components/commonForm/commonForm';
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    }
});

const formatRoleList = rolesList => {
    let formatedList = [];

    if (rolesList) {
        formatedList = rolesList.permissions.map(item => {
            return {
                value: item.permission_id,
                label: item.permission_name,
                description: item.permission_description
            };
        });

        return formatedList;
    }
};
const getSelectedRoleItems = (roleList, selectedRoles) => {
    const selectedItems = roleList.filter(role => {
        return selectedRoles.includes(role.value);
    });

    return selectedItems;
};

class ManageRoles extends React.Component {
    state = {
        initialRole: [],
        roleList: [],
        selectedRoles: [],
        textFieldName: '',
        textFieldDesc: '',
        selectedIdValue: null
    };

    goToBackBtnPage = () => {
        this.props.history.push('/manageRole');
    };
    validateConditions = permissionIdList => {
        const {
            initialRole,
            textFieldName,
            textFieldDesc,
            selectedIdValue
        } = this.state;

        let sortedSelectedIdValue = selectedIdValue.sort();
        let sortedPermissionIdList = permissionIdList.sort();

        if (
            textFieldName === initialRole.role_name &&
            textFieldDesc === initialRole.role_description &&
            JSON.stringify(sortedSelectedIdValue) ===
                JSON.stringify(sortedPermissionIdList)
        ) {
            return true;
        }
        return false;
    };
    saveFunctionality = () => {
        const {
            initialRole,
            selectedRoles,
            textFieldName,
            textFieldDesc
        } = this.state;
        const permissionIdList = selectedRoles.map(item => {
            return item.value;
        });

        const saveFunctionalityDetails = {
            role_name: textFieldName,
            role_description: textFieldDesc,
            role_id: initialRole.role_id,
            permission_id_list: permissionIdList
        };

        if (textFieldName.length == 0) {
            toast.error(ROLENAMEFIELD);
        } else {
            if (textFieldDesc.length == 0) {
                toast.error(ROLEDESCFIELD);
            }
        }

        if (
            textFieldName.length > 0 &&
            textFieldDesc.length > 0 &&
            !this.validateConditions(permissionIdList)
        ) {
            this.props.updateRoleList(JSON.stringify(saveFunctionalityDetails));
        } else {
            this.props.history.push('/manageRole');
        }
    };

    handleChangeDropdown = event => {
        this.setState({ selectedRoles: event.target.value });
    };
    handleTextField = () => {
        if (event.target.name == ROLEFIELD) {
            this.setState({ textFieldName: event.target.value });
            this.setState({ editNameIdx: 1 });
        }
        if (event.target.name == DESCRIPTIONFIELD) {
            this.setState({ textFieldDesc: event.target.value });
            this.setState({ editDescIdx: 1 });
        }
    };

    componentDidMount() {
        const roleId =
            this.props.match && this.props.match.params
                ? this.props.match.params.id
                : null;

        this.props.getSelectedRole(roleId);
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.refreshRoleDetails) {
            const roleId =
                nextProps.match && nextProps.match.params
                    ? nextProps.match.params.id
                    : null;

            nextProps.getRolesList(nextProps.currentOrg.org_id);
            nextProps.getSelectedRole(roleId);
            nextProps.history.push('/manageRole');

            return {
                prevState
            };
        }

        if (
            prevState.selectedRolesPermission !==
                nextProps.selectedRolesPermission &&
            prevState.selectedRoles.length == 0
        ) {
            const roleList = formatRoleList(nextProps.selectedRolesPermission);
            const isSelected = nextProps.selectedRolesPermission.permissions.filter(
                per => per.is_selected === true
            );

            const selectedIdValue = isSelected.map(
                idValue => idValue.permission_id
            );

            const selectedRoles = getSelectedRoleItems(
                roleList,
                selectedIdValue
            );

            return {
                ...prevState,
                roleList,
                selectedRoles,
                initialRole: nextProps.selectedRolesPermission,
                textFieldName: nextProps.selectedRolesPermission.role_name,
                textFieldDesc:
                    nextProps.selectedRolesPermission.role_description,
                selectedIdValue
            };
        }
        return prevState;
    };

    componentWillUnmount() {
        this.setState({
            textFieldDesc: '',
            textFieldName: '',
            editNameIdx: -1,
            editDescIdx: -1,
            selectedRoles: []
        });
        this.props.resetAllValueOfRole();
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
                    variant={EDIT}
                />
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedRolesPermission:
            state.roleManagementData.selectedRolesPermission,
        refreshRoleDetails: state.roleManagementData.refreshRoleDetails,
        currentOrg: state.appData.currentOrg
    };
};
const mapDispatchToProps = dispatch => ({
    getSelectedRole: data => dispatch(getSelectedRole(data)),
    updateRoleList: data => dispatch(updateRoleList(data)),
    getRolesList: data => dispatch(getRolesList(data)),
    resetAllValueOfRole: () => dispatch(resetAllValueOfRole())
});
export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ManageRoles)
);
