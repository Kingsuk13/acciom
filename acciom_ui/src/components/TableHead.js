import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
  
      if(property ==='Action'){
        return;
      }
  this.props.onRequestSort(event, property);
    };
  
    render() {
      const {  order, orderBy, rowCount,headers,headerCss } = this.props;
    
      const {id,label}=this.props.headers;
     
      
      return (
        // <TableHead className="table_head tr th">
          <TableHead >
          <TableRow>
        
         
              {headers.map(
              (row) => (
                <TableCell
                  key={row.id}
                  className={headerCss}
                  align={row.label ==='Action'?'right':'left'}
              
                  sortDirection={orderBy === row.id ? order : false}
                >
              
              <Tooltip
                    title={row.label}
                    placement={row.id ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      direction={order}
                      onClick={this.createSortHandler(row.id)}
                      hideSortIcon={row.label ==='Action'}
                      className={this.props.toolbarCss}
                    >
               
                   {row.label}
                    </TableSortLabel>
                  </Tooltip>
                  
                </TableCell>
              ),
              this,
            )}
          </TableRow>
        </TableHead>
      );
    }
  }
  EnhancedTableHead.propTypes = {
 
    onRequestSort: PropTypes.func.isRequired,
   
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  export default EnhancedTableHead;