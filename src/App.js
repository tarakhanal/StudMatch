import React, { Component } from 'react'
import './App.css';
import LoginPage from './Components/LoginPage/LoginPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null
    }
  }

  fetchLogin = (email, password) => {

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
          <div>

          </div>
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
