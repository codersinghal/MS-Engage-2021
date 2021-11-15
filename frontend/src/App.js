import logo from './logo.svg';
import './App.css';
import React,{Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch,Routes } from "react-router-dom";
import AuthContext from './context/authContext'
import Login from './components/Login/login';
import Register from './components/Register/register' 
import Landing from './components/Landing/landing'
import Schedule from './components/Schedule/Schedule'
class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >

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
              
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;
