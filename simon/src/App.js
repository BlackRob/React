import React from 'react'
import {nextStep, MySvg} from './Helpers'
import './App.css'
import soundR from './simonSound1.mp3'

export default class Simon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userSequence: [],
      pattern: [],
      activePattern: [],
      steps: 0,
      index: 0,
      userTimeout: 1500,
      acceptClicks: true,
      flashing: false,
      waiting: false,
      stepOn: "n",
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    }
    this.step = this.step.bind(this)
    this.addStep = this.addStep.bind(this)
    this.setSize = this.setSize.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.timeStepOn = 800
    this.timeStepOff = 300
  }
  setSize() {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    this.setState({w: width, h: height})
  }
  componentWillMount() {
    this.setSize()
  }
  componentDidMount() {
    window.addEventListener("resize", this.setSize);
    console.log("Simon mounted")
  }
  componentWillUnmount() {
    window.addRemoveListener("resize", this.setSize);
    console.log("Simon unmounted")
  }
  addStep() {
    this.setState({
      activePattern: [],
      acceptClicks: false,
      stepOn: "n"
    })
    // a pause after we press start before the sequence starts
    setTimeout(() => {
      this.step()
    }, this.timeStepOff)
  }
  handleClick(werd) {
    if (this.state.acceptClicks) {
      this.setState({ stepOn: werd})
    }
  }
  flashButton(butt) {
    this.setState({
      stepOn: butt,
      flashing: true
    })
    return (new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.setState({ stepOn: "n", flashing: false}))
      },this.timeStepOn)
    }).then (() => {
      this.setState({waiting: true})
      setTimeout(() => {
        this.setState({waiting: false})
      }, 800)
    }).then (() => console.log("done")))
  }
  step() {
    return new Promise((resolve,reject) => {
      let next = null
      if (this.state.index === this.state.pattern.length) {
        next = nextStep()
      } else next = this.state.pattern[this.state.index]
      this.setState({
        activePattern: this.state.activePattern.concat(next), 
        index: this.state.index + 1
      })
      resolve(this.flashButton(next))
    }).then( () => {
      if (this.state.activePattern.length <= this.state.steps) {
        this.step()
      } else {
        this.setState({
          active: false, 
          pattern: this.state.activePattern, 
          steps: this.state.steps + 1,
          index: 0,
          stepOn: "n",
          acceptClicks: true,
          waiting: false
        })
      }
    })
  }
  render() {
    return (
      <div id="appContainer">
        <MySvg on={this.state.stepOn} w={this.state.w} h={this.state.h} 
          click={this.handleClick}/>
        <div id="controls">
          <button onClick={this.addStep}>START</button>
          <h4>{this.state.activePattern.join()}</h4>
        </div>
      </div>
    )
  }
}