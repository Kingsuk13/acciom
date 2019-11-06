import React, { Component } from 'react'
import { connect } from 'react-redux';
import '../css/Db-ui-styles.css';
import { Link } from 'react-router-dom';
import { Panel, Table, Button, Modal} from 'react-bootstrap';
import { getAllTestSuites } from '../actions/testSuiteListActions';
import EditIcon from '@material-ui/icons/Edit';
import { showProjectSwitchPage } from '../actions/appActions';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DeleteIcon from '@material-ui/icons/Delete';
export class ViewSuite extends Component {
    constructor(props) {
		super(props);
		this.state = {
			
		};
    }
    

    componentDidMount(){
        console.log(this.props.currentProject)
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.refreshTestSuites) {
			nextProps.getAllTestSuites(nextProps.currentProject.project_id);
		}
        return null;
    }

    renderSuiteList = (suiteList) =>{
       return suiteList.map((item,index)=>{
        return (
            <tr key={index}>
            
                <td>{item.test_suite_name}</td>
                <td>{item.created_at}</td>
                <td>
                    
                {/* <Link to={`/edit_test_case/${item.test_suite_id}`}> */}
                <EditIcon fontSize="small"  style={{color:"#696969"}} />
                <DeleteIcon className="cursorhover" fontSize="small" style={{color:"#696969"}} />
                </td>
            </tr>	
        );
       })
    };

    handleSwitchProject = () => {
		this.props.showProjectSwitchPage(true);
	};
    render() {
        return (
                <div className="viewDbDetailsForm">
				<div className='btnContainer'>
                <BusinessCenterIcon className="manageSuitIcon" />
				<label className="db_page_title main_titles">Manage Test Suites</label>
					<div className='project-switch'><Button className="button-colors" bsStyle="primary" onClick={ (e) => this.handleSwitchProject()}>Switch Project</Button> </div>
                    <div className='project-switch'>
                    <Link to={"/create_suite"}>
                    <Button className="button-colors newSuite" type="button" bsStyle="primary">New Suite</Button>
                    </Link>
                     </div>

				</div>
				<Table responsive className="manage-db-table">
					<thead className="table_head">
						<tr>
						
							<th>Suite Name</th>
							<th>Uploaded at</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody className="table_body">
						{ this.renderSuiteList(this.props.suitelist) }
					</tbody>
				</Table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
        currentProject: state.appData.currentProject,
        refreshTestSuites: state.testSuites.refreshTestSuites,
        suitelist:state.testSuites.testSuiteList?state.testSuites.testSuiteList:[]

	};
};
const mapDispatchToProps = dispatch => ({
    getAllTestSuites: (data) => dispatch(getAllTestSuites(data)),
    showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data)),
});


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewSuite);
