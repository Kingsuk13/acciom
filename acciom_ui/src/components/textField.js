import React, { Component,Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import RefreshIcon from '@material-ui/icons/Refresh';

const componentTextField =(props)=>{
    const {valueToBePassed,editIdx}=props;
   
    return(
        <Fragment>
            <TextField
id="standard-read-only-input"

value={valueToBePassed}
style={{width:'108%',marginLeft:'30px'}}
margin="normal"
InputProps={{
  readOnly: true,

  endAdornment: (
    <InputAdornment position="end">
       
      <IconButton
        edge="end"
        onClick={()=>props.clicked()}
      >
      <RefreshIcon />
      </IconButton>
     
    </InputAdornment>
  ),
}}
variant="outlined"
/>

        </Fragment>
    )

}
export default componentTextField;