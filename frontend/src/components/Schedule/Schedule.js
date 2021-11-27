/* eslint-disable */

import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import TimePicker from "material-ui/TimePicker";
import './Schedule.css'
import {Redirect} from 'react-router-dom'
import {withRouter} from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import moment from 'moment'
import AuthContext from '../../context/authContext'
import Stepper from '../IntroStepper/introStepper'
import services from '../../services/other_services'
import {toast} from 'react-toastify';
import EventComponent from '../EventComponent/eventComponent'
import DateTimePicker from 'react-datetime-picker';
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
      teamMembers:[],
      specialMention:null,
      events: [],
      title: "",
      start: "",
      end: "",
      desc: "",
      openSlot: false,
      openEvent: false,
      joinTeamOpen:false,
      createNewTeamOpen:false,
      clickedEventID:null,
      slackToken:null,
      slackChannel:null
    };
    this.state.userID=localStorage.getItem('userID');
    this.handleClose = this.handleClose.bind(this);
  }




  // get teams and set states on component mount
  async componentDidMount(){
    if(!localStorage.getItem('token'))
    return 
    console.log(this.context.userID)
    try {
      var myTeams=await services.getTeams_service(this.state.userID)
    console.log(myTeams)
    myTeams=myTeams.teams;
    this.setState({teams:myTeams})
    // if(myTeams.length>0)
    // {
    //   await this.setTeamStates(myTeams[0].teamID,myTeams[0].teamName)
    // }
    
    } catch (error) {
      console.log(error)
      toast.error(error, {
        // Set to 8sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    }
    

  }

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false, createNewTeamOpen:false,joinTeamOpen:false,specialMention:null });
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
    console.log("event", event);
    this.setState({
      openEvent: true,
      clickedEventID: event.scheduleID,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      specialMention:event.specialMention
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
  handleStartTime = (date) => {
    console.log(date)
    this.setState({ start: date });
  };

  // sets end time of event
  handleEndTime = (date) => {
    console.log(date)
    this.setState({ end: date });
  };

  // allows admin to create new event
  async setNewAppointment() {
    const { start, end, title, desc,specialMention } = this.state;
    try {
      const resp = await services.createNewEvent_service(this.state.teamID,title,desc,start,end,specialMention)
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
    const { title, desc, start, end, events, clickedEventID,specialMention } = this.state;
    try {
      console.log(specialMention)
      const updatedEvent=await services.updateEvent_service(this.state.teamID,title,desc,start,end,clickedEventID,specialMention);
      console.log(updatedEvent)
    const index=events.findIndex(event=> event.scheduleID===clickedEventID)
    console.log(index)
    const updatedEvents=this.state.events.slice();
    updatedEvents[index].title=updatedEvent.title;
    updatedEvents[index].desc=updatedEvent.desc;
    updatedEvents[index].specialMention=updatedEvent.specialMention
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
          var resp=await services.createNewTeam_service(this.state.userID,this.state.newTeamName,this.state.slackChannel,this.state.slackToken);
          toast.success('Team Created Successfully', {
            // Set to 8sec
            position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
          this.setState({newTeamName:null})
          this.setState({slackChannel:null,slackToken:null});

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
        console.log(resp)
        const admins=resp.teamAdmins;
        this.setState({isAdmin:false})
        this.setState({teamCode:null});
        this.setState({teamMembers:resp.teamMembers})
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

  handleSpecialMention = (event,index,value) =>{
    const specialMention=this.state.teamMembers[index-1];
    console.log(specialMention)
    this.setState({specialMention:specialMention});
  }

  handleLogout() {
      this.context.logout();
      this.props.history.replace("/");
  }
  


  render() {
    console.log("render()");
    // actions for create team modal
    const createTeamActions = [
      <RaisedButton
        label="Create"
        primary={true}
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
        disabled={!this.state.isAdmin}
        keyboardFocused={true}
        onClick={() => {
          this.deleteEvent(), this.handleClose()
        }}
      />,
      <RaisedButton
        label="Confirm Edit"
        primary={true}
        keyboardFocused={true}
        disabled={!this.state.isAdmin}
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
        {!localStorage.getItem('token') && <Redirect from="/dashboard" to="/" exact />}
        <Toolbar style={{backgroundColor:"#1f5156"}}>
        <ToolbarGroup>
          <h2 style={{fontSize:'2vw',fontFamily:'Pacifico',color:'yellow',cursor:'pointer'}} onClick={()=>this.setState({teamID:null})}>SchedPut</h2>
        </ToolbarGroup>
        <ToolbarGroup>
        <DropDownMenu id='ddmenu' maxHeight={300} value={0} style={{fontSize:'26px'}} style={{backgroundColor:"#1f5156",fontSize:'20px'}} onChange={this.handleTeamChange}>
        <MenuItem value={0} primaryText="My Teams" disabled={true} />
        {this.state.teams.map((team,i)=>{
             return (<MenuItem value={i+1} primaryText={team.teamName}/>)
        })}
      </DropDownMenu>
      <RaisedButton label="Join Team" primary={true} onClick={()=>this.handleJoinTeam()}/>
      <FloatingActionButton title='Create a Team' mini={true} style={{marginRight:'10px'}} onClick={()=>this.handleAddTeam()}>
      <ContentAdd />
    </FloatingActionButton>
    <RaisedButton label="Logout" primary={true} onClick={()=>this.handleLogout()}/>
        </ToolbarGroup>
        </Toolbar>
         {!this.state.teamID &&
         <React.Fragment>
         <h2 style={{textAlign:'center',marginTop:'80px'}}>Your Guide to Get Started</h2>
         <div className='content' style={{background:'https://cms-static.wehaacdn.com/igin-com/images/Capture.3073.jpg'}}>
            <Stepper/>
         </div>
         </React.Fragment>}
         

        <div className='App'>
          {this.state.teamID &&
          <React.Fragment>
            <h1>{this.state.teamName}</h1>
            { this.state.isAdmin &&
            <Chip title='Click To Copy Team Code ' style={{margin:'auto'}} onClick={()=>this.handleCopyCode()}>
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
          components={{
            event: EventComponent
          }}
          defaultDate={new Date()}
          selectable={true}
          // eventPropGetter={(event) => {
          //   const backgroundColor = event.allday ? 'yellow' : 'blue';
          //   return { style: { border: "black",
          //   borderStyle: "solid" } }
          // }}
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
        ><div style={{display:'flex'}}>
          <div>
          <div>
          <DateTimePicker
        onChange={this.handleStartTime}
        value={this.state.start}
      />
      </div>
      <br/>
      <div>
      <DateTimePicker
        onChange={this.handleEndTime}
        value={this.state.end}
      />
      </div>
      <br/>
      <br/>
          <TextField
            floatingLabelText="Title"
            onChange={e => {
              this.setTitle(e.target.value.trim());
            }}
          />
          <br />
          <br />
          <br />
          <TextField
            floatingLabelText="Description"
            onChange={e => {
              this.setDescription(e.target.value.trim());
            }}
          />
          <br/>
      <br/>
      <br/>
      </div>
      <div style={{margin:'auto'}}>
      <DropDownMenu maxHeight={300} value={0} style={{fontSize:'26px'}} style={{fontSize:'20px'}} onChange={this.handleSpecialMention}>
        <MenuItem value={0} primaryText="Mention Someone" disabled={true}/>
        {this.state.teamMembers.map((user,i)=>{
             return (<MenuItem value={i+1} primaryText={user.memberFirstName+" "+user.memberLastName}/>)
        })}
      </DropDownMenu>
      </div>
      </div>
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
            hintText="Enter Team Name"
            onChange={e=>{
              this.setState({newTeamName:e.target.value.trim()})
            }}
            />
            <br/>
            <br/>
            <br/>
            <TextField
            hintText="Enter Your Slack Channel Name for this Team"
            onChange={e=>{
              this.setState({slackChannel:e.target.value.trim()})
            }}
            />
            <br/>
            <br/>
            <br/>
            <TextField
            hintText="Enter Slack Token for the Channel"
            onChange={e=>{
              this.setState({slackToken:e.target.value.trim()})
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
              this.setState({joinTeamCode:e.target.value.trim()})
              
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
        ><div style={{display:'flex'}}>
        <div>
        <div>
        <DateTimePicker
      onChange={this.handleStartTime}
      value={this.state.start}
    />
    </div>
    <br/>
    <div>
    <DateTimePicker
      onChange={this.handleEndTime}
      value={this.state.end}
    />
    </div>
    <br/>
    <br/>
        <TextField
          floatingLabelText="Title"
          multiLine={true}
          defaultValue={this.state.title}
          onChange={e => {
            this.setTitle(e.target.value.trim());
          }}
        />
        <br />
        <br />
        <br />
        <TextField
          floatingLabelText="Description"
          multiLine={true}
          defaultValue={this.state.desc}
          onChange={e => {
            this.setDescription(e.target.value.trim());
          }}
        />
        <br/>
    <br/>
    <br/>
    </div>
    <div style={{margin:'auto'}}>
    <DropDownMenu maxHeight={300} value={0} style={{fontSize:'26px'}} onChange={this.handleSpecialMention}>
      <MenuItem value={0} primaryText="Mention Someone" disabled={true}/>
      {this.state.teamMembers.map((user,i)=>{
           return (<MenuItem value={i+1} primaryText={user.memberFirstName+" "+user.memberLastName}/>)
      })}
    </DropDownMenu>
    </div>
    </div>
        </Dialog>
      </div>
      </div>
  
      </React.Fragment>
    );
  }
}

export default withRouter(Schedule);