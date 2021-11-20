import React, { Component } from "react";

class EventComponent extends React.Component {
    render() {
      console.log(this.props)
      return (
      <span>
      <strong>{this.props.title}</strong>
      {this.props.event.desc&&':  ' + this.props.event.desc}
    </span>
      )
    }
  }

export default EventComponent