/* eslint-disable */

import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import TimePicker from "material-ui/TimePicker";
import './Schedule.css'
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import moment from 'moment'
import NavBar from '../Navbar/Navbar'
import AuthContext from '../../context/authContext'
import Stepper from '../IntroStepper/introStepper'
import services from '../../services/other_services'
import {toast} from 'react-toastify';
import EventComponent from '../EventComponent/eventComponent'
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const localizer = momentLocalizer(moment);


class Schedule extends Component {

  static contextType=AuthContext;

  constructor() {
    super();
    this.state = {
      userID:null,
      teams:[],
      teamID:null,
      teamName:null,
      isAdmin:false,
      teamCode:null,
      newTeamName:null,
      joinTeamCode:null,
      events: [],
      title: "",
      start: "",
      end: "",
      desc: "",
      openSlot: false,
      openEvent: false,
      joinTeamOpen:false,
      createNewTeamOpen:false,
      clickedEventID:null
    };
    this.state.userID=localStorage.getItem('userID');
    this.handleClose = this.handleClose.bind(this);
  }




  // get teams and set states on component mount
  async componentDidMount(){
    console.log(this.context.userID)
    try {
      var myTeams=await services.getTeams_service(this.state.userID)
    console.log(myTeams)
    myTeams=myTeams.teams;
    this.setState({teams:myTeams})
    if(myTeams.length>0)
    {
      await this.setTeamStates(myTeams[0].teamID,myTeams[0].teamName)
    }
    
    } catch (error) {
      console.log(error)
      toast.error(error, {
        // Set to 8sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    }
    

  }

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false, createNewTeamOpen:false,joinTeamOpen:false });
  }

  //  Allows admin to select slot for new event
  handleSlotSelected(slotInfo) {
    if(!this.state.isAdmin)
    return ;
    console.log("Real slotInfo", slotInfo);
    this.setState({
      title: "",
      desc: "",
      start: slotInfo.start,
      end: slotInfo.end,
      openSlot: true
    });
  }

  // Allows admin and members to select existing event
  handleEventSelected(event) {
    if(!this.state.isAdmin)
    return ;
    console.log("event", event);
    this.setState({
      openEvent: true,
      clickedEventID: event.scheduleID,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc
    });
  }

  // sets title of event
  setTitle(e) {
    this.setState({ title: e });
  }

  // sets description of event
  setDescription(e) {
    this.setState({ desc: e });
  }

  // sets start time of event
  handleStartTime = (event, date) => {
    this.setState({ start: date });
  };

  // sets end time of event
  handleEndTime = (event, date) => {
    this.setState({ end: date });
  };

  // allows admin to create new event
  async setNewAppointment() {
    const { start, end, title, desc } = this.state;
    try {
      const resp = await services.createNewEvent_service(this.state.teamID,title,desc,start,end)
      resp.start=new Date(resp.start)
      resp.end=new  Date(resp.end)
      let events=this.state.events.slice();
      events.push(resp);
      this.setState({events:events});
      toast.success('Event Created Successfully', {
        // Set to 3 sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    } catch (error) {
      toast.error(error, {
        // Set to 3 sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    }
    
  }

  //  allows admin to update existing event
  async updateEvent() {
    const { title, desc, start, end, events, clickedEventID } = this.state;
    try {
      const updatedEvent=await services.updateEvent_service(this.state.teamID,title,desc,start,end,clickedEventID);
      console.log(updatedEvent)
    const index=events.findIndex(event=> event.scheduleID===clickedEventID)
    console.log(index)
    const updatedEvents=this.state.events.slice();
    updatedEvents[index].title=updatedEvent.title;
    updatedEvents[index].desc=updatedEvent.desc;
    updatedEvents[index].start=new Date(updatedEvent.start);
    updatedEvents[index].end=new Date(updatedEvent.end);
    this.setState({
      events: updatedEvents
    });
    toast.success('Event Updated Successfully', {
      // Set to 3 sec
      position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    } catch (error) {
       console.log(error)
       toast.error(error, {
        // Set to 3 sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    }
    
  }

  // allows admin to delete existing event
  async deleteEvent() {
    try {
      const resp= await services.deleteEvent_service(this.state.teamID,this.state.clickedEventID)
      var updatedEvents=this.state.events.slice();
      updatedEvents=updatedEvents.filter(event => event.scheduleID !== this.state.clickedEventID)
      this.setState({ events: updatedEvents });
      toast.success('Event Deleted Successfully', {
        // Set to 3 sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    } catch (error) {
      toast.error(error, {
        // Set to 3 sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    }
    
  }

  // copy team joining code to clipboard
  handleCopyCode() {
    console.log('code copied')
    navigator.clipboard.writeText(this.state.teamCode)
  }

  // opens modal on add team click
  handleAddTeam() {
    this.setState({createNewTeamOpen:true})
  }

  // allows user to create a new team
  async createNewTeam() {
    if(!this.state.newTeamName)
        return ;
        try {
          var resp=await services.createNewTeam_service(this.state.userID,this.state.newTeamName);
          toast.success('Team Created Successfully', {
            // Set to 8sec
            position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
          this.setState({newTeamName:null})

          // making api call to get list of updated teams 
          var teamsResp=await services.getTeams_service(this.state.userID);  
          this.setState({teams:teamsResp.teams})
        } catch (error) {
          toast.error('Something went wrong', {
            // Set to 8sec
            position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
        }
    
  }

  // opens modal for join team
  handleJoinTeam() {
      this.setState({joinTeamOpen:true})
  }

  // allows user to join new team
  async joinNewTeam() {
    if(!this.state.joinTeamCode)
      return ;
    try {
      var resp=await services.joinNewTeam_service(this.state.userID,this.state.joinTeamCode);
      toast.success('Team Joined Successfully', {
        // Set to 8sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
      this.setState({joinTeamCode:null});
      var teamsResp=await services.getTeams_service(this.state.userID);  
      this.setState({teams:teamsResp.teams})
      
    } catch (error) {
      toast.error('Something went wrong', {
        // Set to 8sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    }
      
  }

  // get info for teamID,teamName and set states
  async setTeamStates(teamID,teamName) {
        this.setState({teamID:teamID});
        this.setState({teamName:teamName});
        const resp=await services.getTeamDetails_service(teamID);
        const admins=resp.teamAdmins;
        this.setState({isAdmin:false})
        this.setState({teamCode:null});
        const userID=this.state.userID;
        var adminFlag=false;
        admins.some(function(admin,index){
              if(admin.adminID===userID)
              {
                adminFlag=true
                return true
              }
        })
        if(adminFlag)
        {
          this.setState({isAdmin:true});
          this.setState({teamCode:resp.teamCode});
        }
        resp.schedules.forEach(function(sch,index){
          sch.start=new Date(sch.start)
          sch.end=new Date(sch.end);
        })
        this.setState({events:resp.schedules})

  }
  // navigate to different teams
  handleTeamChange = (event, index, value) =>{
      const teamID=this.state.teams[index-1].teamID;
      const teamName=this.state.teams[index-1].teamName;
      this.setTeamStates(teamID,teamName);
    //  this.state.events=await getEvents(this.state.teamID);
  }

  handleLogout() {
      this.context.logout();
  }
  


  render() {
    console.log("render()");
    // actions for create team modal
    const createTeamActions = [
      <RaisedButton
        label="Create"
        primary={false}
        keyboardFocused={true}
        onClick={()=>{
          this.createNewTeam(),this.handleClose()
        }}
      />
    ]

    // actions for join team modal
    const JoinTeamActions = [
      <RaisedButton
        label="Join"
        primary={true}
        keyboardFocused={true}
        onClick={()=>{
          this.joinNewTeam(),this.handleClose()
        }}
      />
    ]

    // actions for edit event modal
    const eventActions = [
      <RaisedButton
        label="Cancel"
        primary={false}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Delete"
        secondary={true}
        keyboardFocused={true}
        onClick={() => {
          this.deleteEvent(), this.handleClose()
        }}
      />,
      <RaisedButton
        label="Confirm Edit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
        onClick={() => {
          this.updateEvent(), this.handleClose()}}
      />
    ];

    // actions for create event modal
    const appointmentActions = [
      <RaisedButton label="Cancel" secondary={true} onClick={this.handleClose} />,
      <RaisedButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.setNewAppointment(), this.handleClose()}}
      />
    ];
    return (
      <React.Fragment>
        <Toolbar style={{backgroundColor:"white"}}>
        <ToolbarGroup>
          <h2 style={{fontSize:'2vw',fontFamily:'Pacifico'}}>LIDO</h2>
        </ToolbarGroup>
        <ToolbarGroup>
        <DropDownMenu maxHeight={300} value={0} style={{fontSize:'26px'}} onChange={this.handleTeamChange}>
        <MenuItem value={0} primaryText="My Teams" />
        {this.state.teams.map((team,i)=>{
             return (<MenuItem value={i+1} primaryText={team.teamName}/>)
        })}
      </DropDownMenu>
      <RaisedButton label="Join Team" primary={true} onClick={()=>this.handleJoinTeam()}/>
      <FloatingActionButton mini={true} style={{marginRight:'10px'}} onClick={()=>this.handleAddTeam()}>
      <ContentAdd />
    </FloatingActionButton>
    <RaisedButton label="Logout" primary={true} onClick={()=>this.handleLogout()}/>
        </ToolbarGroup>
        </Toolbar>
        {/* <NavBar/> */}
         {!this.state.teamID &&
         <div className='content'>
            <Stepper/>
         </div>}
         

        <div className='App'>
          {this.state.teamID &&
          <React.Fragment>
            <h1>{this.state.teamName}</h1>
            { this.state.isAdmin &&
            <Chip style={{margin:'auto'}} onClick={()=>this.handleCopyCode()}>
          <Avatar size={32}>C</Avatar>
          {this.state.teamCode}
        </Chip>
  }
  </React.Fragment>
  }
  
  
  
      
      <div id="Calendar">
        {/* react-big-calendar library utilized to render calendar*/}
        {this.state.teamID &&
        
        <Calendar
          style={{ flex: 1 , minHeight:"90vh"}}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          events={this.state.events}
          timeslots={2}
          defaultView="month"
          defaultDate={new Date()}
          selectable={true}
          onSelectEvent={event => this.handleEventSelected(event)}
          onSelectSlot={slotInfo => this.handleSlotSelected(slotInfo)}
        />
        
  }
        
        {/* Material-ui Modal for booking new appointment */}
        { this.state.isAdmin &&
        <Dialog
          title={`Book an appointment on ${moment(this.state.start).format(
            "MMMM Do YYYY"
          )}`}
          actions={appointmentActions}
          modal={false}
          open={this.state.openSlot}
          onRequestClose={this.handleClose}
        >
          <TextField
            floatingLabelText="Title"
            onChange={e => {
              this.setTitle(e.target.value);
            }}
          />
          <br />
          <TextField
            floatingLabelText="Description"
            onChange={e => {
              this.setDescription(e.target.value);
            }}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="Start Time"
            minutesStep={5}
            value={this.state.start}
            onChange={this.handleStartTime}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="End Time"
            minutesStep={5}
            value={this.state.end}
            onChange={this.handleEndTime}
          />
        </Dialog>
        }
        {// material-ui modal for creating new team
        <Dialog 
        title={"Create A New Team"}
        modal={false}
        actions={createTeamActions}
        open={this.state.createNewTeamOpen}
        onRequestClose={this.handleClose}>
          <TextField
            floatingLabelText="Enter Team Name"
            onChange={e=>{
              this.setState({newTeamName:e.target.value})
            }}
            />
        </Dialog>
        }
        {// material-ui modal for creating new team
        <Dialog 
        title={"Join A Team"}
        modal={false}
        actions={JoinTeamActions}
        open={this.state.joinTeamOpen}
        onRequestClose={this.handleClose}>
          <TextField
            floatingLabelText="Enter Team Code"
            onChange={e=>{
              this.setState({joinTeamCode:e.target.value})
            }}
            />
        </Dialog>
        }
        {/* Material-ui Modal for Existing Event */}
        <Dialog
          title={`View/Edit Appointment of ${moment(this.state.start).format(
            "MMMM Do YYYY"
          )}`}
          actions={this.state.isAdmin && eventActions}
          modal={false}
          open={this.state.openEvent}
          onRequestClose={this.handleClose}
        >
          <TextField
            defaultValue={this.state.title}
            floatingLabelText="Title"
            onChange={e => {
              this.setTitle(e.target.value);
            }}
          />
          <br />
          <TextField
            floatingLabelText="Description"
            multiLine={true}
            defaultValue={this.state.desc}
            onChange={e => {
              this.setDescription(e.target.value);
            }}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="Start Time"
            minutesStep={5}
            value={this.state.start}
            onChange={this.handleStartTime}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="End Time"
            minutesStep={5}
            value={this.state.end}
            onChange={this.handleEndTime}
          />
        </Dialog>
      </div>
      </div>
  
      </React.Fragment>
    );
  }
}

export default Schedule;