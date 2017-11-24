import React from 'react'
import {Help, Controls, MySvg, nextStep, playSound, pause} from './Helpers'
import './App.css'

export default class Simon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userIndex: 0,
      pattern: [],
      index: 0,
      acceptClicks: true,
      stepOn: "",
      record: 0,
      buttonText: "?",
      mode: "MUSIC",
      w: 0,
      h: 0,
      showHelp: false
    }
    this.start = this.start.bind(this)
    this.step = this.step.bind(this)
    this.playSequence = this.playSequence.bind(this)
    this.setSize = this.setSize.bind(this)
    this.userClick = this.userClick.bind(this)
    this.flashButton = this.flashButton.bind(this)
    this.addStep = this.addStep.bind(this)
    this.reset = this.reset.bind(this)
    this.switchMode = this.switchMode.bind(this)
    this.toggleHelp = this.toggleHelp.bind(this)
    this.loser = this.loser.bind(this)
    this.winner = this.winner.bind(this)
    this.clickAction = this.toggleHelp
    this.winningSequenceLength = 20
    /* this object gets passed through chained promises, so each step
      can get it's own options; not in state because doesn't require rerender,
      these values change but are set as defaults here for reference*/
    this.optionObject = { 
      pauseTime: 300, // used by pause, milliseconds
      flashTime: 700, // used by flashButton, milliseconds
      toneTime: 0.7, // used by playSound, seconds
      button: "n",  // used by flashButton
      tone: "n", // used by playSound
      index: 0 // used by step
    }
  }
  setSize() {
    let width = Math.max(window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth)
    let height = Math.max(window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight)
    this.setState({w: width, h: height})
  }
  componentWillMount() {
    window.addEventListener("resize", this.setSize)
    this.setSize()
  }
  componentWillUnmount() {
    window.addRemoveListener("resize", this.setSize)
  }
  switchMode() {
    switch(this.state.mode){
      case "NORMAL":
        console.log("switch to strict mode")
        this.setState({mode: "STRICT", acceptClicks: false, buttonText: "START"})
        this.reset()
        break;
      case "STRICT":
        console.log("switch to music mode")
        this.setState({mode: "MUSIC", acceptClicks: true, buttonText: "?"})
        this.clickAction = this.toggleHelp
        this.reset()
        break;
      default:
        console.log("switch to normal mode")
        this.setState({mode: "NORMAL", acceptClicks: false, buttonText: "START"})
        this.clickAction = this.start
        this.reset()
        break;
    }
  }
  reset() {
    this.setState({
      pattern: [],
      index: 0,
      stepOn: "n", // "n" for none
      userIndex: 0
    })
  }
  start() { // or restart
    // in music mode, "START" is disabled
    if (this.state.mode === "MUSIC") {
      return
    }  
    this.setState({
      buttonText: "RESTART",
      acceptClicks: false,
    })
    this.reset()
    this.optionObject.pauseTime = 300
    this.optionObject.flashTime = 700
    this.optionObject.toneTime = 0.7
    this.optionObject.button = "n"
    this.optionObject.tone = "n"
    this.optionObject.index = 0
    pause(this.optionObject)
      .then(this.addStep)
      //.then(pause)
      .then(this.playSequence)
  }
  //
  addStep(optionObject){
    let next = nextStep()
    this.setState({
      pattern: this.state.pattern.concat(next)
    })
    return new Promise(resolve => {
      resolve(optionObject)
    })
  }
  winner(optionObject) {
    optionObject.pauseTime = 300
    optionObject.flashTime = 300
    optionObject.toneTime = 0.3
    optionObject.button = "all"
    optionObject.tone = "n"
    optionObject.index = 0
    return new Promise(resolve => {
      Promise.resolve(optionObject)
        .then(pause).then(playSound).then(this.flashButton)
        .then(pause).then(playSound).then(this.flashButton) 
        .then(pause).then(playSound).then(this.flashButton)
        .then(() => {
          this.setState({
            acceptClicks: false,
            buttonText: "START"
          })
          resolve(optionObject)
        })
    })
  }
  loser(optionObject) {
    let rightButton = this.state.pattern[this.state.userIndex]
    optionObject.pauseTime = 300
    optionObject.flashTime = 300
    optionObject.toneTime = 0.3
    optionObject.button = rightButton
    optionObject.tone = rightButton + rightButton
    optionObject.index = 0
    return new Promise(resolve => {
      Promise.resolve(optionObject)
        .then(pause).then(playSound).then(this.flashButton)
        .then(pause).then(playSound).then(this.flashButton) 
        .then(pause).then(playSound).then(this.flashButton)
        .then(() => {resolve(optionObject)})
    })
  }
  userClick(char) {
    this.optionObject.button = char
    this.optionObject.tone = char
    // if a game is in the middle of a sequence, random clicks are ignored
    if (!this.state.acceptClicks) return
    // also, if in music mode, just respond to clicks with light and sound
    if (this.state.mode === "MUSIC") {
      playSound(this.optionObject)
      this.flashButton(this.optionObject)
      return
    }  
    // if not in music mode, we must be playing a game
    // if click was correct...
    if (char === this.state.pattern[this.state.userIndex]) {
      let newIndex = this.state.userIndex + 1
      this.setState({userIndex: newIndex})
      Promise.resolve(this.optionObject)
        .then(playSound)
        .then(this.flashButton)
        // check if this was a win 
        .then(() => {
          if (newIndex === this.winningSequenceLength) {
            let longest = Math.max(this.state.record, this.state.pattern.length)
            this.setState({record: longest})
            this.winner(this.optionObject)
          } else if (newIndex === this.state.pattern.length){
            let longest = Math.max(this.state.record, this.state.pattern.length)
            this.setState({record: longest})
            // got this sequence right, so make longer
            pause(this.optionObject)
              .then(this.addStep)
              .then(this.playSequence).catch(console.log.bind(console))
          }
        })
      return
    } else { // if click was incorrect
      // in normal mode, repeat sequence, try again
      if (this.state.mode === "NORMAL") {
        this.optionObject.pauseTime = 0.8
        Promise.resolve(this.optionObject)
          .then(this.loser)
          .then(pause)
          .then(this.playSequence).catch(console.log.bind(console))
        return
      }  else { // strict mode, no second chances   
        Promise.resolve(this.optionObject)
          .then(this.loser)
          .then(this.start).catch(console.log.bind(console))
        return
      }
    }
  }
  flashButton(optionObject) {
    this.setState({ stepOn: optionObject.button})
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState({ stepOn: "n"})
        resolve(optionObject)
      },optionObject.flashTime)
    })
  }
  endSequence() {
    this.setState({
      acceptClicks: true,
      userIndex: 0
    })
  }  
  step(optionObject) {
    optionObject.button = this.state.pattern[optionObject.index]
    optionObject.tone = optionObject.button
    pause(optionObject).then(playSound).then(this.flashButton)
      .then(() => {
        if (optionObject.index === this.state.pattern.length -1) {
          this.endSequence()
        } else {
          optionObject.index = optionObject.index + 1
          return this.step(optionObject)
      }
    })
  }
  playSequence(optionObject) {
    // the user always has to start at the beginning of the sequence
    this.setState({userIndex: 0, acceptClicks: false})
    optionObject.pauseTime = 300
    optionObject.flashTime = 700
    optionObject.toneTime = 0.7
    optionObject.button = "n"
    optionObject.tone = "n"
    optionObject.index = 0
    return new Promise(resolve => {
      Promise.resolve(optionObject)
        .then(this.step).catch(console.log.bind(console)) 
    })
  }
  toggleHelp() {
    if (this.state.showHelp) {
      this.setState({showHelp: false})
    } else {
      this.setState({showHelp: true})
    }
  }
  render() {
    return (
      <div id="appContainer">
        <Help show={this.state.showHelp} toggle={this.toggleHelp}/>
        <MySvg on={this.state.stepOn} w={this.state.w} h={this.state.h} 
          click={this.userClick}/>
        <Controls 
          buttonText={this.state.buttonText} 
          click={this.clickAction}
          currentSequenceLength={this.state.pattern.length}
          recordSequenceLength={this.state.record}
          playerSequenceLength={this.state.userIndex}
          switchMode={this.switchMode}
          modeText={this.state.mode}

        />
      </div>
    )
  }
}