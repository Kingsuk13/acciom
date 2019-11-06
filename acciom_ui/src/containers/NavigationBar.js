import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button,  Modal, ButtonGroup, DropdownButton, Item , MenuItem as MenuItemBS  } from 'react-bootstrap';
import AssignmentIcon from '@material-ui/icons/Assignment';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import PublishIcon from '@material-ui/icons/Publish';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DnsIcon from '@material-ui/icons/Dns';
import StorageIcon from '@material-ui/icons/Storage';
import AppBar from '@material-ui/core/AppBar';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BusinessIcon from '@material-ui/icons/Business';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SvgIcon from '@material-ui/core/SvgIcon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import { logoutFromPortal } from '../actions/loginActions';
import { showOrgChangePage } from '../actions/appActions';
import logo from '../assets/images/logo.png';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import CallToActionTwoToneIcon from '@material-ui/icons/CallToActionTwoTone';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import BorderColorIcon from '@material-ui/icons/BorderColor';


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		height: `70px`
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	labelTitle:{
		color:"gray"
	},
	labelValue:{
		color:"#BD4951"
	},
	menuButton: {
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},

	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	accountbtn : {
		position: 'absolute',
		right: '37px',
		width: '125px',
		height: '30px',
		color: '#3b6d9e',
		fontSize: '16px',
		// textAlign: "center"
	},
	
  	dashboard : {
		color: 'white'
	},
	home : {
		color: 'white'
	},
	startup : {
		color: 'white'
	},
	acciom : {
		color: 'cadetblue'
	},
	acciomimg : {
		width: '70px'
	},
	loginLink : {
	
	}
}

));

const someHandler =() => {
	return (
		<div>
			<a>Forget Password</a>
			<a>Access Token</a>
			<a>LogOut</a>
		</div>
	)
}

const handleShowOrg  = (props, isShow) => {
	props.showOrgChangePage(isShow);
};

const getLoginOptions = (props, classes) => {
	let options = null;
	
	const getLoginElements = () => {
		if (props.loginData && props.loginData.token) {
			return ( <div>
				<DropdownButton className="button-colors account_button"  title="Account" bsStyle="primary" bsSize="small" pullRight noCaret
					onClick={(event) => { event.preventDefault();}}>
					<MenuItemBS eventKey="1" className={classes.width}>
						<Link to="/access_token"  className={classes.width}>Access Token</Link>
					</MenuItemBS>
					<MenuItemBS eventKey="2">
						<Link to="/change_password">Change Password</Link>
					</MenuItemBS>
					
					<MenuItemBS eventKey="4">
						<span id="change_organisation" onClick={(event) => { handleShowOrg(props, true);}}>Change Organisation</span>
					</MenuItemBS>
					<MenuItemBS eventKey="6">
						<span id="logoutLink" className={classes.loginbtn} onClick={(event) => { event.preventDefault(); props.logoutFromPortal() }}>Logout</span>
					</MenuItemBS>
					<MenuItemBS eventKey="8" className={classes.width}>
						<Link to="/user_profile"  className={classes.width}>User Profile</Link>
					</MenuItemBS>
				</DropdownButton>
			</div>
			);
		} else {
			return (
				<div>
					<DropdownButton  title="Account" bsStyle="primary" className="button-colors account_button" bsSize="small" id="dropdown-no-caret loginLink" pullRight noCaret
						onClick={(event) => { event.preventDefault();}}>
						<MenuItemBS eventKey="3">
							<Link to="/forgot_password">Forgot Password</Link>
						</MenuItemBS>
						<MenuItemBS eventKey="3">
							<Link to='/login'>Login</Link>
						</MenuItemBS>
					</DropdownButton>
				</div>
			);
		}
	};

	options = (
		<>
		<div className={classes.accountbtn}>
			{ getLoginElements() }
		</div>
		<div style={{position:"absolute", left:"90px", bottom: "0px"}}>
		<Typography variant="body2" display="inline" align="left" className={classes.labelTitle}>
			Organisation :&nbsp;
		</Typography>
		<Typography variant="caption" display="inline" align="left" className={classes.labelValue}>
			{props.orgName}
		</Typography>
		<Typography variant="body2" display="inline" align="left"  className={classes.labelTitle} style={{marginLeft:"10px"}}>
			Project :&nbsp;
		</Typography>
		<Typography variant="caption" display="inline" align="left" className={classes.labelValue}>
			{props.projectName}
		</Typography>
		</div>
		</>
	)

	return options;
};

function NavigationBar(props) {
	const classes = useStyles();
	const theme = useTheme();
	
	const [open, setOpen] = React.useState(false);

	function handleDrawerOpen() {
		setOpen(true);
	}

	function handleDrawerClose() {
		setOpen(false);
	}
	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				id="db_top_bar"
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}>
				<Toolbar>
				{/*	<IconButton
						color="inherit"
						aria-label="Open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open,
						})}> 
						<MenuIcon />
					</IconButton> */}
					<img className="logo" src={logo} alt="logo" />
					<div className="loginOptions">
						{ getLoginOptions(props, classes) }
					</div>
				</Toolbar> 
			</AppBar>
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					}),
				}}
				open={open} >
				<Divider />
				<List>
					<MenuList className="sideNavBar">
						<MenuItem>
							<ListItemIcon className="navIconPadding">
								<Link to= {'/dashboard'} color= 'primary' >
									<DashboardIcon className = "naviQulityIndexIcon" />
								</Link>
							</ListItemIcon>
							<Link to={`/dashboard`} id="dashbcolor" className = {classes.dashboard} className = {classes.hovercolor} > Dashboard </Link> <br />
						</MenuItem>
						<MenuItem>
							<ListItemIcon className="navIconPadding">
								<Link to={`/test_suite_upload`} className = {classes.home}>
									<PublishIcon  className = "naviQulityIndexIcon" />
								</Link> 
							</ListItemIcon>
							<Link to={`/test_suite_upload`} id="dashbcolor"  className = {classes.home}> Upload Data Profiling </Link> <br />
						</MenuItem>
						<MenuItem>
							<ListItemIcon className="navIconPadding">
								<Link to ={`/startup`} className = {classes.startup}>
									<SwapHorizIcon  className="naviQulityIndexIcon" />
								</Link>
							</ListItemIcon>
							<Link to={`/startup`} id="dashbcolor"  className = {classes.startup}>Data Profiling</Link>
						</MenuItem>
						<MenuItem>
							<ListItemIcon className="navIconPadding">
								<Link to ={`/view_db_details`} className = {classes.startup}>
									<StorageIcon className="naviQulityIndexIcon" />
								</Link>
							</ListItemIcon>
							<Link to={`/view_db_details`} id="dashbcolor"  className = {classes.startup}>Manage DB Connections</Link>
						</MenuItem>
						<MenuItem>
						<ListItemIcon className="navIconPadding">
							<Link to={'/user_management'}>
								<GroupIcon className="naviQulityIndexIcon" />
							</Link>
						</ListItemIcon>
						<Link to={'/user_management'} id="dashbcolor"  className = {classes.startup}>Manage Users</Link>
						</MenuItem>
						<MenuItem>
						<ListItemIcon className="navIconPadding">
							<Link  id="dashbcolor" className = {classes.startup} to={'/view_suites'}>
						
							<BusinessCenterIcon  className="naviQulityIndexIcon" />
							</Link>
						</ListItemIcon>
						<Link to={'/view_suites'} id="dashbcolor"  className = {classes.startup}>Manage Suites</Link>
						</MenuItem>
						<MenuItem>
						<ListItemIcon className="navIconPadding">
							<Link to={'/projects'}>
							<AccountTreeIcon className="naviQulityIndexIcon" />
							</Link>
						</ListItemIcon>
						<Link to={'/projects'} id="dashbcolor"  className = {classes.startup}>Manage Projects</Link>
						</MenuItem>
						<MenuItem>
						<ListItemIcon className="navIconPadding">
							<Link to={'/organization'}>
						
							<BusinessIcon className="naviQulityIndexIcon" />
							</Link>
						</ListItemIcon>
						<Link to={'/organization'} id="dashbcolor"  className = {classes.startup}>Manage Organisation</Link>
						</MenuItem>
						
						<MenuItem>
						<ListItemIcon className="navIconPadding">
							<Link to={'/manageRole'}>
						
							<AccountBoxIcon className="naviQulityIndexIcon" />
							</Link>
						</ListItemIcon>
						<Link to={'/manageRole'} id="dashbcolor"  className = {classes.startup}>Manage Roles</Link>
						</MenuItem>
						<MenuItem>
						<ListItemIcon>
							<Link to={'/query_analyzer'}>
						
							<BorderColorIcon className="projectManagementNavIcon" />
							</Link>
						</ListItemIcon>
						<Link to={'/query_analyzer'} id="dashbcolor"  className = {classes.startup}>Analyze Query</Link>
						</MenuItem>
					</MenuList>
				</List>
			</Drawer>
			<div className="left_dropdown_btn">
						{open ? <IconButton className="leftbar_closebtn" onClick={handleDrawerClose}>
							<ChevronLeftIcon className="ChevronLeftIconcolor" />
						</IconButton> : 
							<IconButton
								color="inherit"
								aria-label="Open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								className={clsx(classes.menuButton,classes.leftbarscrollbtn, {
								[classes.hide]: open,
							})}> 
							<MenuIcon className="ChevronLeftIconcolor" />
						</IconButton>}
						</div>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		loginData: state.loginData,
		projectName: state.appData.currentProject.project_name,
		orgName: state.appData.currentOrg !== null ? state.appData.currentOrg.org_name : "" ,
	}
};
const mapDispatchToProps = (dispatch) => ({
	logoutFromPortal: () => dispatch(logoutFromPortal()),
	showOrgChangePage: (data) => dispatch(showOrgChangePage(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);