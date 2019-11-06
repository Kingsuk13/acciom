import React from 'react';
import { connect  } from 'react-redux';
import Button from '@material-ui/core/Button';
import { showProjectSwitchPage } from '../actions/appActions';
import { getAllTestSuites } from '../actions/testSuiteListActions';
import TestSuiteList from './TestSuiteList';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

class Startup extends React.Component {

	constructor(props) {
		super(props);
		this.state ={}
		if (this.props.currentProject) {
			this.props.getAllTestSuites(this.props.currentProject.project_id);
		}
	}
	// componentDidMount() {
	// }

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.refreshTestSuites) {
			nextProps.getAllTestSuites(nextProps.currentProject.project_id);
		}
		return null;
	}

	render() {
		return (
			<div className='testSuiteList'>
				<div className='page-title'>
				<SwapHorizIcon className="profileicon2" />
					<h2 className="main_titles dataprofilingtitle">Data Profiling</h2>
					<div className='project-switch'>
						<Button className="button-colors switchprojectbtn" variant="contained" onClick={ (e) => this.props.showProjectSwitchPage(true)}>Switch Project</Button> 
					</div>
				</div>
				<TestSuiteList />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentProject: state.appData.currentProject,
		refreshTestSuites: state.testSuites.refreshTestSuites
	};
};

const mapDispatchToProps = dispatch => ({
	getAllTestSuites: (data) => dispatch(getAllTestSuites(data)),
	showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data))
})

export default connect(	mapStateToProps, mapDispatchToProps) (Startup);
