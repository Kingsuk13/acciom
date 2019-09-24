import React, { Component } from 'react';
import { connect } from 'react-redux';
import GaugeChart from '../components/GaugeChart';
import AreaChart from '../components/BarChart';
import { getDQIprojectDetails } from '../actions/dashboardActions';
// import { getHistoryGraphdata } from '../actions/dashboardActions'; 

class DQIDetailsContainer extends Component {

	render() {

		const colorsArray = [
			['#49a9ea'],
			['#E74B56'],
			['#B370CF'],
			['#E95E4F'],
			['#34495E'],
			['#36CAAB']
		];

		const getGaugeChart = () => {
			if (this.props.projectDataQuality && this.props.projectDataQuality.project_name) {
				return (<GaugeChart class={'DQIprojectGauge'} name={"DQI"} percentage={this.props.projectDataQuality.project_dqi_percentage} />) 
			}
		};

		const getDPIdetailsChart = () => {
			let chartList = [];
			if (this.props.projectDataQuality && this.props.projectDataQuality.project_name) {
				chartList =  this.props.projectDataQuality.project_dqi_detail.map((item, index) => {
					return (<li key={ index }><GaugeChart name={item.name} class={'DQIprojectGaugeDetail'} percentage={item.value} width={215} color={colorsArray[index]}/></li>);
				})
				return chartList; 
			}
		}

		return (
			<>
			<div className="DQIprojectChartContainer projectList">
				<div className="row detailsChart">
					{getDPIdetailsChart()}
				</div>
				{/* <div className="row"> */}
					
				{/* </div> */}
			</div>
			{/* <AreaChart /> */}
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		projectDataQuality: state.dashboardData.projectDataQuality,
		currentProject: state.appData.currentProject
	};
};

const mapDispatchToProps = dispatch => ({
	getDQIprojectDetails: (data) => dispatch(getDQIprojectDetails(data)),
	// getHistoryGraphdata: (data) => dispatch(getHistoryGraphdata(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DQIDetailsContainer);
