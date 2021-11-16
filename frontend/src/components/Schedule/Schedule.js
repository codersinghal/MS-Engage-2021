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
import BigCalendar from 'react-big-calendar'
import AuthContext from '../../context/authContext'
import Stepper from '../IntroStepper/introStepper'
import services from '../../services/other_services'
require("react-big-calendar/lib/css/react-big-calendar.css");

BigCalendar.momentLocalizer(moment);


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
    var myTeams=await services.getTeams_service(this.state.userID)
    console.log(myTeams)
    myTeams=myTeams.teams;
    this.setState({teams:myTeams})
    if(myTeams.length>0)
    {
      this.setState({teamID:myTeams[0]._id})
      this.setState({teamName:myTeams[0].teamName})
      // this.setState({teamCode:myTeams[0].teamCode})
      // if(this.state.teamCode)
      // {
      //   this.state.isAdmin=true
      // }
    }
    // if(this.state.teamID)
    // {
    //   this.state.events=await this.getEvents(teamID)
    // }

  }

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false, createNewTeamOpen:false,joinTeamOpen:false });
  }

  //  Allows admin to select slot for new event
  handleSlotSelected(slotInfo) {
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
      clickedEventID: event.eventID,
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
    let appointment = { title, start, end, desc };
    let events = await addNewEvent(this.state.teamID,appointment)
    this.setState({ events });
  }

  //  allows admin to update existing event
  async updateEvent() {
    const { title, desc, start, end, events, clickedEventID } = this.state;
    let appointment={title,start,end,desc}
    let updatedEvents=await updateEventService(this.state.teamID,clickedEventID,appointment)
    this.setState({
      events: updatedEvents
    });
  }

  // allows admin to delete existing event
  async deleteEvent() {
    let updatedEvents = await deleteEventService(this.state.teamID,this.state.clickedEventID)
    this.setState({ events: updatedEvents });
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
    var resp=await services.createNewTeam_service(this.state.userID,this.state.newTeamName);
    this.setState({teams:resp.teams})
    this.setState({newTeamName:null})
  }

  // opens modal for join team
  handleJoinTeam() {
      this.setState({joinTeamOpen:true})
  }

  // allows user to join new team
  async joinNewTeam() {
    if(!this.state.joinTeamCode)
      return ;
    var resp=await services.joinNewTeam_service(this.state.userID,this.state.joinTeamCode);
    this.setState({teams:resp.teams});
    this.setState({joinTeamCode:null});  
  }

  // navigate to different teams
  async handleTeamChange(event,index,value) {
      this.state.teamName=this.state.teams[index-1].teamName;
      this.state.teamID=this.state.teams[index-1].teamID;
      this.state.teamCode=this.state.teams[index-1].teamCode;
      this.state.isAdmin=this.state.teams[index-1].isAdmin;
      this.state.events=await getEvents(this.state.teamID);
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
        <DropDownMenu maxHeight={300} value={0} style={{fontSize:'26px'}}>
        <MenuItem value={0} primaryText="My Teams" disabled={true} />
        {this.state.teams.map((team,i)=>{
             return (<MenuItem value={i+1} primaryText={team.teamName}/>)
        })}
      </DropDownMenu>
      <RaisedButton label="Join Team" primary={true} onClick={()=>this.handleJoinTeam()}/>
      <FloatingActionButton mini={true} style={{marginRight:'10px'}} onClick={()=>this.handleAddTeam()}>
      <ContentAdd />
    </FloatingActionButton>
    <RaisedButton label="Logout" primary={true} />
        </ToolbarGroup>
        </Toolbar>
         {!this.state.teamID &&
         <div className='content'>
            <Stepper/>
         </div>}
         

        <div className='App'>
          {this.state.teamID &&
          <React.Fragment>
            <h1>{this.state.teamName}</h1>
            { this.state.isAdmin &&
            <Chip style={{margin:'auto'}} onClick={()=>this.handleCopyCode}>
          <Avatar size={32}>C</Avatar>
          AXU5G80
        </Chip>
  }
  </React.Fragment>
  }
  
  
  
      
      <div id="Calendar">
        {/* react-big-calendar library utilized to render calendar*/}
        {this.state.teamID &&
        
        <BigCalendar
          events={this.state.events}
          views={["month", "week", "day"]}
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