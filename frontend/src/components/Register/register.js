import React, { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./register.css";
import Ripples from "react-ripples";
import AuthContext from '../../context/authContext'

export default class Register extends Component {

    static contextType=AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      showPassword:false,
      showConfirmPassword:false,
      isTeacher:true
    };
  }
  showPassword=()=>{
    this.setState(prevState=>({
      showPassword:!prevState.showPassword,
    }))
  }
  showConfirmPassword=()=>{
    this.setState(prevState=>({
      showConfirmPassword:!prevState.showConfirmPassword,
    }))
  }

  registerAsTeacher=()=>{
      this.setState(prevState=>({
          isTeacher:!prevState.isTeacher,
      }))
  }

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  handleEmailChange = (e) => {
    let value = e.target.value;
    this.setState({
      email: value,
    });
  };
  handlePasswordChange = (e) => {
    let value = e.target.value;
    this.setState({
      password: value,
    });
  };
  handleConfirmPassword = (e) => {
    let value = e.target.value;
    this.setState({
      confirmPassword: value,
    });
  };
  handleFormSubmit = (e) => {
    e.preventDefault();
    if (this.state.password === this.state.confirmPassword) { 
      // make api call to register user
      fetch(process.env.NODE_ENV==='production'?"https://whispering-falls-52777.herokuapp.com/register":
      "http://localhost:5000/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password,
          name: this.state.username,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let error = data.msg;
          if (error) this.props.showError(error);
          else {
            this.context.login(data.token,data.userId, data.isTeacher);
          }
        });
    } else {
      // Show flash about error
      this.props.showError("Password do not match");
    }
  };

  render() {
    return (
      <div className="card" id="login">
        <div className="card-header">Sign Up</div>
        <div className="card-body">
          <form id="register">
            <div className="form-group">
              <label className="col-form-label">Name</label>
              <input
                className="form-control"
                type="text"
                value={this.state.username}
                onChange={this.handleUsernameChange}
                placeholder="Enter Name"
              />
            </div>
            <div className="form-group">
              <label className="col-form-label">Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={this.state.email}
                onChange={this.handleEmailChange}
                placeholder="Enter Email"
              />
            </div>
            <div className="form-group">
              <label className="col-form-label">Password</label>
              <input
                className="form-control"
                type={this.state.showPassword?"type":"password"}
                value={this.state.password}
                onChange={this.handlePasswordChange}
                placeholder="Enter Password"
              />
              <span style={{fontSize:"12px"}}><input style={{width:"10px",height:"10px",margin:"5px"}}  type="checkbox" onClick={this.showPassword} />show password</span>
            </div>
            <div className="form-group">
              <label className="col-form-label">Confirm Password</label>
              <input
                className="form-control"
                type={this.state.showConfirmPassword?"type":"password"}
                value={this.state.confirmPassword}
                onChange={this.handleConfirmPassword}
                placeholder="Enter Password"
              />
              <span style={{fontSize:"12px"}}><input style={{width:"10px",height:"10px",margin:"5px"}}  type="checkbox" onClick={this.showConfirmPassword} />show password</span>              
            </div>
            <div>
            <span style={{fontSize:"16px"}}><input style={{width:"14px",height:"14px",margin:"5px"}}  type="checkbox" onClick={this.registerAsTeacher} />Register As a Student</span>
            </div>
            <div>
            <span id="note">
              Already a member ?<Link to="/"> Login</Link>
            </span>
            </div>
          </form>
        </div>
        <Ripples>
          <button onClick={this.handleFormSubmit} className="btn btn-primary">
            Sign Up
          </button>
        </Ripples>
      </div>
    );
  }
}