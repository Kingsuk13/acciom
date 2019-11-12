import React, { Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import {
    SAVE,
    BACKBTNPAGE,
    ROLEFIELD,
    DESCRIPTIONFIELD,
    Permissions,
    EDIT_ROLES,
    EDIT,
    ADD_ROLES
} from '../../constants/FieldNameConstants';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { TextField } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
const CommonForm = props => {
    const {
        handleSaveFunctionality,
        dropdownValue,
        roleList,
        handleDropdown,
        handleBackButton,
        textFieldName,
        textFieldDesc,
        handleTextField,
        variant
    } = props;
    return (
        <Fragment>
            <PersonAddIcon className="editRoleEditIcon" />
            <h3 className="usermanagetitle main_titles">
                {variant === EDIT ? EDIT_ROLES : ADD_ROLES}
            </h3>
            <Paper className="manageRolePaper">
                <TextField
                    label={ROLEFIELD}
                    className="textFieldStyleName"
                    value={textFieldName}
                    name={ROLEFIELD}
                    onChange={handleTextField}
                />

                <TextField
                    label={DESCRIPTIONFIELD}
                    className="textFieldStyleDesc"
                    value={textFieldDesc}
                    name={DESCRIPTIONFIELD}
                    onChange={handleTextField}
                />
                <FormControl className="formStyle">
                    <InputLabel className="inputLabel">
                        {Permissions}
                    </InputLabel>
                    <Select
                        multiple
                        value={dropdownValue}
                        onChange={handleDropdown}
                        renderValue={() => (
                            <div className="chipStyle">
                                {dropdownValue.map((value, index) => (
                                    <Chip
                                        key={value.label}
                                        label={value.label}
                                        className="singleChipStyle"
                                    />
                                ))}
                            </div>
                        )}
                    >
                        {roleList.map((role, index) => (
                            <MenuItem
                                key={index}
                                value={role}
                                style={{ color: '#ffc0cb ' }}
                            >
                                {role.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    className="button-colors rolesSaveButton"
                    bsStyle="primary"
                    onClick={handleSaveFunctionality}
                >
                    {SAVE}
                </Button>

                <Button
                    variant="contained"
                    className="backbutton_colors rolesBackButton"
                    onClick={handleBackButton}
                >
                    {BACKBTNPAGE}
                </Button>
            </Paper>
        </Fragment>
    );
};
export default CommonForm;
