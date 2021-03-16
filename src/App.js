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

  //We call fetchlogin in app.js so we can reference the user object throughout our app.
  //Alternatively we could fetch the auth token in LoginPage.js and pass it to this component
  //but I think it makes more sense to make the call here.
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
