import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Projects extends Component {
  constructor(props) {
    super(props)
    this.state = {
      color: styles,
    }
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        <nav className="flexNav">
          <h1>Stuff I've Coded</h1>
        </nav>
      </div>
    );
  }
}

export default App;
