import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { connect } from 'react-redux';



class AreaChart extends Component {
     
	constructor(props) {
	  super(props);
		
	}

	render() {
		let options = {
			dataLabels: {
			enabled: false
			},
			stroke: {
			curve: 'smooth'
			},
			colors: ['#49a9ea','#36CAAB','#B370CF','#E95E4F','#34495E'],
			xaxis: {
			type: 'date',
			categories: []
			},
			tooltip: {
			x: {
				format: 'dd/MM/yy'
			},
			},
		}

		let series =  [{name:"Completeness",data:[]},
					   {name:"Valid",data:[]},
					   {name:"Uniqueness",data:[]},
					   {name:"Correcteness",data:[]},
					   {name:"Consistency",data:[]},
					   {name:"AverageDQI",data:[]}
					];

		options.xaxis.categories = [];
		if (this.props.projectDataHistory !== undefined) {
			options.xaxis.categories = Object.keys(this.props.projectDataHistory);
			for(let prop in this.props.projectDataHistory){
				var date_object=this.props.projectDataHistory[prop];
				series[0].data.push(date_object.hasOwnProperty('Completeness') ? date_object.Completeness : 0);
				series[1].data.push(date_object.hasOwnProperty('Valid') ? date_object.Valid : 0);
				series[2].data.push(date_object.hasOwnProperty('Uniqueness') ? date_object.Uniqueness : 0);
				series[3].data.push(date_object.hasOwnProperty('Correcteness') ? date_object.Correcteness : 0);
				series[4].data.push(date_object.hasOwnProperty('Consistency') ? date_object.Consistency : 0);
				series[5].data.push(date_object.hasOwnProperty('AverageDQI') ? date_object.AverageDQI : 0);
			}
		}
		return (
		<div id="chart">
			{/* <Chart options={options()} series={this.state.series} type="area" height="350" /> */}
		  <Chart options={options} series={series} type="area" height="350" />
		</div>
		);
	}
  }


const mapStateToProps = state => {
	return {
		projectDataQuality: state.dashboardData.projectDataQuality,
		currentProject: state.appData.currentProject,
		projectDataHistory: state.dashboardData.projectDataHistory
	};
};

const mapDispatchToProps = dispatch => ({
	getDQIprojectDetails: (data) => dispatch(getDQIprojectDetails(data)),
	getHistoryGraphdata: (data) => dispatch(getHistoryGraphdata(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AreaChart);
