import React, { Component } from 'react';
import{ connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Row, FormGroup, FormControl, ControlLabel, HelpBlock, Panel } from 'react-bootstrap';
import { generateToken } from '../actions/loginActions';
import Button from '@material-ui/core/Button';

class AuthToken extends Component{
	constructor(props){
		super(props);
		this.state = {
			isToken: false,
			value: '',
			copied: false,
			accessTokenArray:[],
			textValue:'',
			finalTextValue:[],
			storeTextModify :[],
		}
	}
componentDidMount(){
	
	var savedValueToken=JSON.parse(localStorage.getItem('TokenValue')) ;
	

		this.setState({finalTextValue:savedValueToken});
	


}

	onGenerateButtonClick = (e) => {
		e.preventDefault();
	
		let initialValueArr =[];
		let accessTokenObj = {
			'message': 'this is for test'
		}
		this.setState({isToken : true});
		this.props.generateToken(JSON.stringify(accessTokenObj));
		
	
		initialValueArr=	this.state.storeTextModify.concat({
			text:this.state.textValue
			
		});
		this.setState({storeTextModify:initialValueArr})
	
		localStorage.setItem('TokenValue',JSON.stringify(initialValueArr));
		this.setState({finalTextValue:initialValueArr});
	
		this.setState({textValue:''})
	


	}
	handleTextHandler=(e)=>{

		this.setState({textValue:e.target.value});
	
		
	}

	render(){
	
	
		const{finalTextValue}=this.state;
	

		
		return(
			<div className=''>
				<Panel>
					<Panel.Heading className="accesstknheader">
						<h5 className="msginline">Message</h5>
						<input className= "needTokeneditbox" 
						placeholder="Why you need this Token ?"
						value ={this.state.textValue}
						
						onChange={(e) => {this.handleTextHandler(e)}}></input>
					</Panel.Heading >
					<Panel.Body className="panelheight sub_title"><h5>Personal Access Token</h5>
					<Link to="/dashboard"><Button variant="contained" className="backbutton_colors generatetokenbackbutton">Back</Button></Link>
						<Button variant="contained" title="Click here to Generate Token"  className="generatetokenbutton button-colors" onClick={(e) => {this.onGenerateButtonClick(e)}}>Generate Token</Button>                  
					</Panel.Body>
					{this.state.isToken ? (
						<Panel.Body className="tokenpanelBackground">
							<div>Make sure to copy your new personal access token now. You won’t be able to see it again!</div><br></br>
							<input className="tokenField" value={this.props.accessToken} onChange={({target: {value}}) => this.setState({value, copied: false})} />
							<CopyToClipboard text={this.props.accessToken} onCopy={() =>this.setState({copied: true})}>
								<i class="fas fa-copy fa-lg clipboardOnhover"></i>
							</CopyToClipboard>
						</Panel.Body>
					) : null}

			{finalTextValue? <ul>
               
			   {finalTextValue.map( (strResult,index) =>{
				   return <li key ={index} 
				   >{strResult.text}</li>
			 })}
		   
		 </ul>:null}
            
				</Panel>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		accessToken: state.loginData.accessToken,
		storeToken:state.loginData.storeToken,
		storeData:state.loginData.storeData
	};
};

const mapDispatchToProps = dispatch => ({
	generateToken: (data) => dispatch(generateToken(data)),
	// getStoredText:(data)=>dispatch(getStoredText(data))
})

// export default AuthToken;
export default connect(mapStateToProps, mapDispatchToProps)(AuthToken);