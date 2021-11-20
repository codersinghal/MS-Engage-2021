import React, { Component } from "react";
import { Link,withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./register.css";
import Ripples from "react-ripples";
import AuthContext from '../../context/authContext'
import {Redirect} from 'react-router-dom'
import auth_services from '../../services/auth_services';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

class Register extends Component {

    static contextType=AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      first_name: "",
      last_name:"",
      password: "",
      confirmPassword: "",
      showPassword:false,
      showConfirmPassword:false
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

  handleFirstNameChange = (e) => {
    this.setState({
      first_name: e.target.value,
    });
  };
  handleLastNameChange = (e) => {
    this.setState({
      last_name: e.target.value,
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
      auth_services.register_service(this.state.first_name,this.state.last_name,this.state.email,this.state.password).then((res)=>{
        console.log(res);
        this.context.login(res.token,res.userID)
        toast.success('Register Successful', {
          // Set to 3 sec
          position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
          this.props.history.push("/dashboard");
      }).catch((err)=>{
        console.log(err);
        toast.error(err, {
          // Set to 3 sec
          position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
      })
    } else {
      // Show flash about error
      this.props.showError("Password do not match");
    }
  };

  render() {
    return (
      <React.Fragment>
        {localStorage.getItem('token') && (
                  <Redirect from="/register" to="/dashboard" exact />
                )}
      <div className="card" id="login">
        <div className="card-header">Sign Up</div>
        <div className="card-body">
          <form id="register">
            <div className="form-group">
              <label className="col-form-label">First Name</label>
              <input
                className="form-control"
                type="text"
                value={this.state.first_name}
                onChange={this.handleFirstNameChange}
                placeholder="Enter First Name"
              />
            </div>
            <div className="form-group">
              <label className="col-form-label">Last Name</label>
              <input
                className="form-control"
                type="text"
                value={this.state.last_name}
                onChange={this.handleLastNameChange}
                placeholder="Enter Last Name"
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
      </React.Fragment>
    );
  }
}
export default withRouter(Register);