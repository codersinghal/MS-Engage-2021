import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import Ripples from "react-ripples";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";

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
    fetch("http://localhost:4001/login",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password,
        }),
      }
    )
      .then((res) => {
        if (res.statusText === "Unauthorized") {
          return { msg: "Invalid email or password" };
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data.msg) this.props.showError(data.msg);
        else this.context.login(data.token, data.userId, data.isTeacher);
      });
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
          <button className="btn btn-primary">
            Login
          </button>
        </Ripples>
      </div>
    );
  }
}