import './App.css';
import React,{Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch,Routes,withRouter } from "react-router-dom";
import AuthContext from './context/authContext'
import Login from './components/Login/login';
import Register from './components/Register/register' 
import Landing from './components/Landing/landing'
import Schedule from './components/Schedule/Schedule'
class App extends Component {
  state = {
    token: null,
    userID: null
  };

  // called on user login success
  login = (token, userID) => {
    this.setState({ token: token, userID: userID });
    localStorage.setItem('token',this.state.token)
    localStorage.setItem('userID',this.state.userID)
  };

  // called on user logout
  logout = () => {
    this.setState({ token: null, userID: null });
    localStorage.clear();

  };

  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userID: this.state.userID,
              login: this.login,
              logout: this.logout
            }}
          >
            <Switch>
            <Route exact path="/">
              <Login/>
              <Landing/>
            </Route>
            <Route path='/register'>
              <Register/>
              <Landing/>
            </Route>
            <Route path='/dashboard'>
              <Schedule/>
            </Route>
            </Switch>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default (App);
