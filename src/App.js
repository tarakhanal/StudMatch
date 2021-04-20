import React, { Component } from 'react'
import './App.css';
import LoginPage from './Components/LoginPage/LoginPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContainer from './Components/AppContainer/AppContainer';

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null
    }
  }

  fetchLogin = (user) => {
    this.setState({user})
  }

  // toast notifications from package react-toastify
  displayMessageHandler = (message) => {
    toast(`${message}`, {
        className: 'errorToastNotification',
        bodyClassName: 'errorToastBody',
        progressClassName: 'errorToastProgressBar'
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.user ?
          <AppContainer
            logoutHandler={() => this.setState({user: null})}
            user={this.state.user}
          />
        :
          <LoginPage
            fetchLogin={this.fetchLogin}
            displayMessageHandler={this.displayMessageHandler}
          />
        }
        <ToastContainer />
      </div>
    );
  }
}

export default App;
