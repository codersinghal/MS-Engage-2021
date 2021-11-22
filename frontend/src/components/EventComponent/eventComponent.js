import React, { Component } from "react";
import moment from 'moment'
import Avatar from 'material-ui/Avatar';

class EventComponent extends React.Component {
  render() {
    console.log(this.props)
    const userIcon = this.props.event.specialMention?<Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoi0VAfAICJCum1V31Qym93-xZYBfsOVF41A&usqp=CAU" />:null;

    return (
      <div>
        {userIcon}
        <strong style={{margin:'7px'}}>{this.props.event.title}</strong>
    {this.props.event.desc && <span> : {this.props.event.desc}</span>}
    <div style={{margin:'4px'}}>
      {this.props.event.specialMention && <span>{this.props.event.specialMention[0].memberFirstName}</span>}
    </div>
        {/* <span className="pull-right">
          {bookedIcon}
         {this.props.event.noOfPax} <i className="fa fa-user"></i>
        </span> */}
      </div>
    );
  }
  }

export default EventComponent