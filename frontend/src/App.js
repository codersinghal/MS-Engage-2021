import logo from './logo.svg';
import './App.css';
import React,{Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch,Routes } from "react-router-dom";
import AuthContext from './context/authContext'
import Login from './components/Login/login';
import Register from './components/Register/register' 
class App extends Component {
  state = {
    token: null,
    userId: null,
    isTeacher:true
  };

  login = (token, userId, isTeacher) => {
    this.setState({ token: token, userId: userId, isTeacher:isTeacher });
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
              isTeacher: this.state.isTeacher,
              login: this.login,
              logout: this.logout
            }}
          >
            
            <Route exact path="/">
              <Login/>
            </Route>
            <Route path='/register'>
              <Register/>
            </Route>
              <div className="heading">
          <div className="title">
            <h1>LIDO</h1>
            <p>Schedule and Book your classes here !!</p>
          </div>

          <div className="thumbnail"></div>
        </div>
        <div className="footer"></div> 
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;
