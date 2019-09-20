
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';
import EnhancedTableHead from '../components/TableHead';

let counter = 0;


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  // return;
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function searchingFor(search){
  return function(x){
    
    return (x.first_name.toLowerCase().includes(search.toLowerCase())||
    x.last_name.toLowerCase().includes(search.toLowerCase())||
    x.email.toLowerCase().includes(search.toLowerCase()) );
  }
}

// class EnhancedTableHead extends React.Component {
//   createSortHandler = property => event => {

//     if(property ==='Action'){
//       return;
//     }
// this.props.onRequestSort(event, property);
//   };

//   render() {
//     const { onSelectAllClick, order, orderBy, rowCount,headers,headerCss } = this.props;
    
//     return (
//       <TableHead >
//         <TableRow>
      
       
//             {headers.map(
//             (row) => (
//               <TableCell
//                 key={row.id}
//                 // className={headerCss}
//                 align={row.label ==='Action'?'right':'left'}
            
//                 padding='10px'
//                 sortDirection={orderBy === row.id ? order : false}
//               >
            
//             <Tooltip
//                   title={row.label}
//                   placement={row.id ? 'bottom-end' : 'bottom-start'}
//                   enterDelay={300}
//                 >
//                   <TableSortLabel
//                     direction={order}
//                     onClick={this.createSortHandler(row.id)}
//                     hideSortIcon={row.label ==='Action'}
//                   >
             
//                  {row.label}
//                   </TableSortLabel>
//                 </Tooltip>
                
//               </TableCell>
//             ),
//             this,
//           )}
//         </TableRow>
//       </TableHead>
//     );
//   }
// }

// EnhancedTableHead.propTypes = {
 
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.string.isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
});

let EnhancedTableToolbar = props => {
  const {  classes } = props;
  
  return (
    <Toolbar
      className={classes.root}
    >
      <div className={classes.title}>
     
      <TextField
        id="search"
        placeholder="Search"
        type="search"
        className={classes.textField}
        margin="normal"
        onChange ={props.searchData}
        value ={props.textValue}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {props.textValue? 
              <IconButton
                edge="end"
                onClick={props.clearText}
              >
              <Clear />
              </IconButton>:null}
             
            </InputAdornment>
          ),
        }}
      />
     
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
    
           <Tooltip title ="Add Role">
            <IconButton  onClick={props.addBtnFunctionality} >
           <AddIcon/>
          </IconButton>
          </Tooltip>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
   
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  headerStyles:{
   
    backgroundColor: '#BD4951',
    color: '#ffffff',
    margin:'10px',
   
  },
  tableRowStyling:{
    fontFamily: 'Open Sans !important',
    padding:'15px !important'
  },
  cellStyling:{
    textAlign:'right !important'
  },
  deleteIcon:{
   marginLeft:'7px', 
   color:"#696969",
    padding :'1px',

  }
 

});

class CustomPaginationActionsTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'Username',
    selected: [],
     page: 0,
    rowsPerPage: 5,
    search:'',
    testVar:[],
  };

  handleRequestSort = (event, property) => {

    const orderBy = property;

    let order = 'desc';
 

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
    
  };

  handleSelectAllClick = event => {
    
    let isCheckboxSelected = [];
  
    if (event.target.checked) {
      isCheckboxSelected =this.props.userList.map(id=>id.user_id);
     
      this.setState({selected:isCheckboxSelected});
     
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
  
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
  

    this.setState({ selected: newSelected });

  };
  addRowsinTable=()=>{
    const newData=[];
    const data =[...this.props.userList];
    data.push(newData);
    console.log('Add Button',this.props);
  }
  handleChangePage = (event, page) => {
    
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value,page:0 });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  searchTable=()=>{
    
    this.setState({search:event.target.value})
  }
  clearTextField=()=>{
    this.setState({search:''});
  }
	static getDerivedStateFromProps = (nextProps, prevState) => {
    console.log('nextProps',nextProps);
    console.log('prevState',prevState);
    // this.setState({testVar:nextProps.userList});
  }
  render() {
    const { classes,headers,userList } = this.props;
    const {  order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, userList.length - page * rowsPerPage);
  
     console.log('render var',this.state.testVar);
    return (
      <Paper className={classes.root}>
   
        <EnhancedTableToolbar 
        searchData ={this.searchTable} 
        textValue={this.state.search}
        clearText={this.clearTextField} 
        addBtnFunctionality ={this.addRowsinTable}/>
      
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle" size='small'>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={userList.length}
              headers={headers}
              headerCss ={classes.headerStyles}
            
            />
            {/* <TableBody className="table_body"> */}
            <TableBody >
           {stableSort(userList, getSorting(order, orderBy))
                 .filter(searchingFor(this.state.search))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
              
               
                
                  const isSelected = this.isSelected(user.user_id);
                 

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, user.user_id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                       key={user.user_id}
                      selected={isSelected}
                    
                   
                    >
                    
                      <TableCell component="th" scope="row"  align="left"
                         className={classes.tableRowStyling}>
                        {user.first_name}
                      </TableCell>
                      <TableCell align="left" component="th" scope="row"  
                      className={classes.tableRowStyling}>{user.last_name}</TableCell>
                      <TableCell align="left" component="th" scope="row"  
                      className={classes.tableRowStyling}>{user.email}</TableCell>
                     <TableCell className={classes.cellStyling}>
                     <Link to={`/edit_user_role/${user.user_id}`}>
                    <EditIcon />
                     </Link>	
                     <DeleteIcon className={classes.deleteIcon}  />
                     </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={userList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomPaginationActionsTable);