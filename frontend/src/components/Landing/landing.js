import React,{Component} from 'react'
import './landing.css'
export default class Landing extends Component{

    render() {
        return (
            <React.Fragment>
            <div className="heading">
            <div className="title">
              <h1>SchedPut</h1>
              <p>Organizing Schedules For Teams Simplified!!</p>
            </div>
  
            <div className="thumbnail"></div>
          </div>
          <div className="footer"></div>
          </React.Fragment> 
        );
    }
}