
import React, { Component,Fragment } from 'react';
import NotesIcon from '@material-ui/icons/Notes';
import { ANALYZE_QUERIES, QUERY, SELECT_CONNECTION, RUN_QUERY } from '../constants/FieldNameConstants';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import { 
	getAllConnections, 
} from '../actions/testSuiteListActions';
import socketIOClient from "socket.io-client";
import { LOCAL_BASE_URL } from '../actions/appActions';


const formatConnections = connectionsList => {
  let formatedconnectionsList = [];

  if (connectionsList) {
    formatedconnectionsList = connectionsList.map(item => {
          return {
              value: item.db_connection_id,
              label: item.db_connection_name,
             
          };
      });

      return formatedconnectionsList;
  }
};

class QueryAnalyzer extends Component {
 
componentDidMount(){
  const { endpoint } = this.state;

    const socket = socketIOClient(endpoint);
    // socket.on("FromAPI", data => this.setState({ response: data }));
 
    socket.on( data => {
     
      return{
      data
      }

    });
}
  static getDerivedStateFromProps = (nextProps, prevState) => {
   
    if(nextProps.allConnections.length ==0){
      nextProps.getAllConnections(nextProps.currentProject.project_id);
    }
    if (prevState.allConnections !== nextProps.allConnections) {
      const allConnections = formatConnections(nextProps.allConnections);
      return {
          ...prevState,
          allConnections
      };
  }
    return prevState
  }
  
    handleDropdown = event => {
      
        this.setState({ connections: event.target.value });
    };
    handleQueryTextChange=()=>{
      this.setState({query_text:event.target.value});
    }
    enableButton=()=>{
      const {connections,query_text}=this.state;

      if(connections.length !==undefined || query_text.length ==0){

       return true
      }
      else{
      
        return false
      }
     
    }
    state = {
     connections:[],
     allConnections:[],
     query_text:'',
    
    endpoint: 'http://172.16.17.179:5000/api/socket',
      
    };
    render(){
        const {connections,allConnections,query_text,endpoint}=this.state;
   
        return(
            <Fragment>
                 <div>
                 
                   < NotesIcon className="queryAnalysisIcon" />
                    &nbsp; &nbsp;
                    <label className="main_titles queryManagementMargin">
                        {ANALYZE_QUERIES} </label>
                        </div>
                        <div className='queryLable sub_title' style={{   color: '#69717D !important',fontSize: '15px',fontWeight:'bold'}}>{QUERY}</div>
                        <Fragment>
                        <FormControl  className="queryAnalysisDropdown">
        <InputLabel id="demo-simple-select-filled-label" style ={{marginTop:'2px'}}>{SELECT_CONNECTION}</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={connections}
          onChange={this.handleDropdown}
          renderValue={() => (
            <div className="chipStyle">
             
                    <Chip
                        key={connections.value}
                        label={connections.label}
                        className="singleChipStyle"
                    />
               
            </div>
        )}
        >
         
            {allConnections.map((connection) => (
                            <MenuItem
                                key={connection.value}
                                value={connection}
                                style={{ color: '#ffc0cb ' }}
                            >
                                {connection.label}
                            </MenuItem>
                        ))}
        </Select>
      </FormControl>
      </Fragment>
      <TextareaAutosize 
      aria-label="minimum height" 
      rows={5} 
      className="queryTextArea"
      onChange={this.handleQueryTextChange}
      />
   
      <Button
                    className='button-colors runQueryButtoon'
                    bsStyle="primary"
                    // onClick={handleSaveFunctionality}
                 
                  disabled ={this.enableButton()}
                >{RUN_QUERY}</Button>
                  

            </Fragment>
        )
    }

}
const mapStateToProps =state=>{
  return{
 
    currentProject : state.appData.currentProject,
    allConnections : state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
  }
}
const mapDispatchToProps =dispatch =>({
  getAllConnections:(data)=>dispatch( getAllConnections(data))

})

export default connect(mapStateToProps,mapDispatchToProps)(QueryAnalyzer);