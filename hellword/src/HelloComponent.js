import React from 'react'
import styles from './HelloComponent.scss'

export class Hello extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 
      color: styles.on,
      switchedOn: true,
      buttonText: 'OFF',
      preO: '',
      _O: '',
      postO: '',
      workingO: true,
      colorO: styles.on 
    }
    this.toggleSwitch = this.toggleSwitch.bind(this)
    this.addLetter = this.addLetter.bind(this)
    this.flickerO = this.flickerO.bind(this)
    this.toggleO = this.toggleO.bind(this)
  }
  
  componentWillMount () {
    console.log("willmount")
    this.buildStrings(0)
  }
  
  toggleSwitch () {
    /* in the browser, each letter is visualized as an independent
      letter in a neon sign; the sign can be turned on or off by
      a button, but after a little while the 'O' flickers and stops
      working */
    let newColor = this.state.color === styles.on ? styles.off : styles.on
    let newText = this.state.buttonText === 'ON' ? 'OFF' : 'ON'
    let newColorO = newColor
    if (!this.state.workingO) {
      newColorO = styles.off
    };
    this.setState({ color: newColor, buttonText: newText, colorO: newColorO })
  };
  
  buildStrings(i) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.addLetter(i))
      },500)
    }).then (() => {
      if ( i < 16 ) {
        /* this loops more times than it needs to (11)
        so we have a slight delay before calling flicker */
        this.buildStrings(i+1)
      } else this.flickerO(0)
    })
  }
 
  flickerO(i) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.toggleO())
      },150)
    }).then (() => {
      if ( i < 7 ) {
        this.flickerO(i+1)
      } else {
        this.setState({colorO: styles.off, workingO: false})
        console.log("done")
      }
    })
  }
  
  toggleO() {
    let newColorO = this.state.colorO === styles.on ? styles.off : styles.on
    this.setState({colorO: newColorO})
  }
  
  /* addLetter builds the strings our "lamp" is made of */
  addLetter(i) {
    let str = "HELLO WORLD"
    if (i <= 4) {
      this.setState({preO: str.slice(0,i)})
    } else if (i == 5) {
      this.setState({_O: "O "})
    } else if (i < 11) {
      this.setState({postO: str.slice(6,i+1)})
    }
  }

  render () {
    return (<div>
        <p>
          <span className={this.state.color}>
            {this.state.preO}
          </span>
          <span className={this.state.colorO} >
            {this.state._O}
          </span>
          <span className={this.state.color}>
            {this.state.postO}
          </span>
        </p>
        <button onClick={this.toggleSwitch}>
          {this.state.buttonText}
        </button>
      </div>
    )
  }
}