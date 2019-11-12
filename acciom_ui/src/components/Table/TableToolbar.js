import React, { Fragment } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    spacer: {
      flex: '1 1 100%',
    },
    title: {
      flex: '0 0 auto',
    },
    textField: {
      marginLeft: '0px',
      marginRight: '10px',
      
      width: 200,
      height:'auto !important'
    },
    startIcon:{
     paddingBottom:'10px'
    },
  }));
  
// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: '2px'
//   },
//   title: {
//     flexGrow: 1,
//   },
// });


  function TableToolbar(props){
    const classes = styles();
    const { handleSearch, handleClear, search,variant } = props;
  
    if(variant ==='queryTable'){
      return(
        <Fragment>
        
            <Toolbar >
       
           <IconButton 
           edge="start"
           className={classes.menuButton} 
           >
          <Clear />
          </IconButton>

         
          <Button 
          variant="contained" 
          // onClick={() => this.userProfileSubmit()} 
          className="button-query "
          color="inherit">
            Export</Button>
          
           <IconButton 
           edge="end">
           <Search   style ={{float:'right'}}/>
          </IconButton>

     
        

       
          
       </Toolbar>
     
        </Fragment>
      
      )
    }
    return (
      <Toolbar className={classes.root}>
        <div className={classes.title}>
        <TextField
          id="search"
          placeholder="Search"
          type="search"
          className={classes.textField}
          margin="normal"
          onChange ={handleSearch}
          value ={search}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"
               className={classes.startIcon}>
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {search? 
                <IconButton
                  edge="end"
                  onClick={handleClear}
                >
                <Clear />
                </IconButton>:null}
               
              </InputAdornment>
            ),
          }}
        />
        </div>
        <div className={classes.spacer} />
      </Toolbar>
    );
  };
  
  // export default withStyles(styles)(TableToolbar)
  export default (TableToolbar)
