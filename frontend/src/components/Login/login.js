import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import Ripples from "react-ripples";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import auth_services from '../../services/auth_services'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

export default class Login extends Component {

    static contextType=AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword:false,
    };
  }
  showPassword=()=>{
    this.setState(prevState=>({
      showPassword:!prevState.showPassword,
    }))
  }
  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  checkUser = () => {
    auth_services.login_service(this.state.email,this.state.password).then((res)=>{
           console.log(res);
           this.context.login(res.token,res.userID)
           toast.success('Login Successful', {
            // Set to 3 sec
            position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})
    }).catch((err)=>{
      console.log(err)
      toast.error(err, {
        // Set to 3 sec
        position: toast.POSITION.BOTTOM_LEFT, autoClose:3000})

    })
  };
  componentDidMount(){
    console.log("Login component mounted");
  }
  render() {
    return (
      <div className="card" id="login">
        <div className="card-header">Login</div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label className="col-form-label">Username</label>
              <input
                className="form-control"
                type="text"
                value={this.state.email}
                onChange={this.handleEmailChange}
                placeholder="Enter Email"
              />
            </div>
            <div className="form-group">
              <label className="col-form-label">Password</label>
              <input
                className="form-control"
                type={this.state.showPassword?"text":"password"}
                value={this.state.password}
                onChange={this.handlePasswordChange}
                placeholder="Enter Password"
              />
              <span style={{fontSize:"12px"}}><input style={{width:"10px",height:"10px",margin:"5px"}}  type="checkbox" onClick={this.showPassword} />show password</span>
             
            </div>
            <span>
              New user ?<Link to="/register"> Sign Up</Link>
            </span>
          </form>
        </div>
        <Ripples>
          <button className="btn btn-primary" onClick={this.checkUser}>
            Login
          </button>
        </Ripples>
      </div>
    );
  }
}