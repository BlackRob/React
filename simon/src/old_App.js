import React from 'react'
import jackdaw from './jackdaw.svg'
import './App.css'


export const sampleElement = (
  <h2>In the game "Simon", "Simon" represents God</h2>
)

class App extends React.Component {
  
  render() {
    return (
      <div>
        <Headr werds="Simon says..." />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Clock />
        <Simon />
        {sampleSVG}
        <Fart loudness="quiet" />
      </div>
    )
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {date: new Date()}
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    )
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div>
        <h3>{this.state.date.toLocaleTimeString()}</h3>
      </div>
    )
  }
}

function Headr(props) {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">{props.werds}</h1>
    </header>
  )
}

const sampleSVG = (
  <img src={jackdaw} alt=""/>
)

function Fart(props) {
  if (props.loudness === "quiet") {
    return <h4>pffft!</h4>
  } else {
    return <h1>PPPPPPPFFFFFFFFT!</h1>
  }
}


export default App
