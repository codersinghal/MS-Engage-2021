import React, { Component } from "react";
import moment from 'moment'
import Avatar from 'material-ui/Avatar';

class EventComponent extends React.Component {
  render() {
    console.log(this.props)
    const userIcon = this.props.event.specialMention?<Avatar style={{margin:'6px'}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWHu3oid1S_3pCE4Vq23yfQHSV2d1zUVgggw&usqp=CAU" />:null;

    return (
      <div style={{display:'flex'}}>
        <div>
        {userIcon}
        </div>
        <div>
          <div>
        <strong style={{margin:'4px',color:'black'}}>{this.props.event.title}</strong>
    {this.props.event.desc && <span style={{color:'black'}}> : {this.props.event.desc}</span>}
    </div>
    <div>
      {this.props.event.specialMention && <span style={{margin:'4px',color:'black'}}><strong style={{color:'black'}}>Mentioned</strong> : {this.props.event.specialMention[0].memberFirstName}</span>}
    </div>
        {/* <span className="pull-right">
          {bookedIcon}
         {this.props.event.noOfPax} <i className="fa fa-user"></i>
        </span> */}
      </div>
      </div>
    );
  }
  }

export default EventComponent