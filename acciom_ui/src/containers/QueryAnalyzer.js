
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

import {  getTableData,getSingleQuery } from '../actions/queryAnalyzerActions';
import socketIOClient from "socket.io-client";
import ComponentTextField from '../components/textField';
import CustomTable from '../components/Table/CustomTable';
import { getAllDBDetails } from '../actions/dbDetailsActions';
import {ifSelectOrgDropdown} from '../actions/appActions';



// const formatConnections = connectionsList => {
//   let formatedconnectionsList = [];

//   if (connectionsList) {
//     formatedconnectionsList = connectionsList.map(item => {
//           return {
//               value: item.db_connection_id,
//               label: item.db_connection_name,
             
//           };
//       });

//       return formatedconnectionsList;
//   }
// };

class QueryAnalyzer extends Component {
  socket = socketIOClient('http://172.16.21.192:5001/socket')
  
 
componentDidMount(){
 



    this.props.getTableData(this.props.currentProject.project_id);
    this.getfunction() ;
    
}
  static getDerivedStateFromProps = (nextProps, prevState) => {
  
    console.log('Next Props in static',nextProps);
console.log('prevState in static',prevState);


if (nextProps.refreshDBDetails){

nextProps.getAllDBDetails(nextProps.currentProject.project_id);
return{
  ...prevState
}

}
 

    if(nextProps.projectQueryData.length ==0){
   
      
      nextProps.getTableData(nextProps.currentProject.project_id);
      return{
        ...prevState,
        
    
      }
    }
    if(prevState.projectQueryData !==nextProps.projectQueryData){
      return{
        ...prevState,
        projectQueryData:nextProps.projectQueryData
      }
    }
    
    

    return {
      ...prevState,
      dbDetailsList:nextProps.dbDetailsList
    }
  }
  displayTable=(index)=>{
   
    this.setState({editIdx:index});
   
    
  }
    handleDropdown = event => {
      
        this.setState({ connections: event.target.value });
        this.props.ifSelectOrgDropdown(false);
        
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

    handleButton=()=>{
     
      const singleQueryDetails ={
        "project_id":this.props.currentProject.project_id,
        "connection_id":this.state.connections.db_connection_id,
         "query":this.state.query_text

      }

      this.props.getSingleQuery( JSON.stringify(singleQueryDetails));
      
    }
    state = {
     connections:[],
 
     dbDetailsList:[],
     query_text:'',
     
    endpoint: 'http://172.16.21.192:5000/socket',
    response:false,
    editIdx:-1,
     headers :[
			{ id: 'query_id',  label: 'Query Id' },
			{ id: 'execution_status',  label: 'Execution Status' },
			{ id: 'query_result', label: 'Query Result' }
          ],
          projectQueryData:[]
      
    };

    getfunction = () => {
      this.socket.on('my_response',function(data,cb) {
      console.log("PING!", data);
      });
       this.socket.emit('join', {room: "1"});
    }
    render(){
        const {connections,query_text,editIdx,headers,dbDetailsList}=this.state;
        const {projectQueryData}=this.state;
   
       
   

        return(
            <Fragment>
                 <div>
                 
                   < NotesIcon className="queryAnalysisIcon" />
                    &nbsp; &nbsp;
                    <label className="main_titles queryManagementMargin">
                        {ANALYZE_QUERIES} </label>
                        </div>
                        <div className='queryLable sub_title' 
                       
                        >{QUERY}</div>
                        <Fragment>
                        <FormControl  className="queryAnalysisDropdown">
        <InputLabel 
        id="demo-simple-select-filled-label" 
        style ={{marginTop:'-4px'}}>{SELECT_CONNECTION}</InputLabel>
        <Select
       
          id="demo-simple-select-filled"
          value={connections}
          onChange={this.handleDropdown}
          renderValue={() => {
          
            return(
              <div className="chipStyle">
            {this.props.isDropdownChanged?null:  <Chip
                  key={connections.db_connection_id}
                  label={connections.db_connection_name}
                  className="singleChipStyle"
              />}
            
         
      </div>

            )
            
         
          }
          
      }
        >
      
              {this.props.dbDetailsList.map((connection) => ( 
             
                            <MenuItem
                                key={connection.db_connection_id}
                                value={connection}
                                style={{ color: '#ffc0cb ' }}
                            >
                                {connection.db_connection_name}
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

                   onClick ={this.handleButton}
                  disabled ={this.enableButton()}
                >{RUN_QUERY}</Button>
                  
             {projectQueryData?projectQueryData.map((project,index)=>{
          
              let currentIndex =index;
              const currentlyEditing =editIdx===currentIndex
       
              return(   
              <Fragment>
              {!currentlyEditing ? 
              (<ComponentTextField
              valueToBePassed ={project. query_string}
              clicked ={()=>this.displayTable(index)}
              editIdx={editIdx}
              
              />):(
                <CustomTable
                headers={headers}
                bodyData={projectQueryData}
                variant = "queryTable"
                />
              )
              }
              </Fragment>
              )
             }

             ):''}
           
          
            </Fragment>
        )
    }

}
const mapStateToProps =state=>{
  return{
    dbDetailsList: state.dbDetailsData.dbDetailsList?state.dbDetailsData.dbDetailsList: [],
    currentProject : state.appData.currentProject,
    refreshDBDetails: state.dbDetailsData.refreshDBDetails,
    
    projectQueryData:state.queryAnalyzerData.projectQueryData,
    isDropdownChanged:state.appData.isDropdownChanged

  }
}
const mapDispatchToProps =dispatch =>({
 
  getTableData:(data)=>dispatch(getTableData(data)),
  getSingleQuery:(data)=>dispatch(getSingleQuery(data)),
  getAllDBDetails: (data) => dispatch(getAllDBDetails(data)),
  ifSelectOrgDropdown: (data) => dispatch(ifSelectOrgDropdown(data)),
  
  

})

export default connect(mapStateToProps,mapDispatchToProps)(QueryAnalyzer);