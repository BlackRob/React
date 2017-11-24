import React from 'react'

// choose and return next color button
export const nextStep = () => {
  const choices = ["r","y","g","b"]
  let next = Math.floor(Math.random()*4)
  return choices[next]
}
// a configurable pause
export const pause = (optionObject) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(optionObject)
    },optionObject.pauseTime)
  })
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

// first number is the frequency of the tone, second is a gain 
// adjustment: higher frequencies sound louder... not sure if this is
// the correct way to deal with it, but it seems to work
const sounds = {
  b: [329, 0.501], bb: [658, 0.251],
  y: [277, 0.596], yy: [554, 0.297],
  r: [440, 0.375], rr: [880, 0.187],
  g: [165, 1], gg: [329, 0.501],
  n: [220, 0.75]
}
export function playSound(optionObject) {
  let sound = optionObject.tone
  let duration = optionObject.toneTime // seconds
  let volumeTweak = sounds[sound][1]

  let oscillator = audioCtx.createOscillator()
  let gainNode = audioCtx.createGain()
  let currentTime = audioCtx.currentTime;

  gainNode.gain.value = 0;
  oscillator.type = "sine"
  oscillator.frequency.value = sounds[sound][0]
  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.start(currentTime)
  gainNode.gain.setTargetAtTime(volumeTweak, currentTime, 0.03)
  gainNode.gain.setTargetAtTime(0, currentTime + duration - 0.03, 0.03)
  oscillator.stop(currentTime + duration + 0.1)

  return new Promise(resolve => {
    resolve(optionObject)
  })
}

export const Help = (props) => {
  if (props.show === false) {
    return null
  } else return (
    <div id="comments">
      <div id="infoBlock">
        <div id="facts">
          SIMON...
          <span id="closeFacts" onClick={props.toggle}>x</span>
        </div>
        <p>starts in <strong>MUSIC</strong> mode --press a button, make a sound.</p>
        <p><strong>NORMAL</strong> mode: a series of button flashes which the player has to repeat. Get it right, the series repeats with an extra step. Get it wrong, the game will repeat the sequence so you can try again.</p>
        <p><strong>STRICT</strong> mode is like normal except you don't get a second chance when you make a mistake, you have to start over.</p>
        <p><strong>In either mode you need to get 20 steps right to win.</strong></p>
        <p>See more stuff I've made at <a href="http://workingclasshouses.com" >workingclasshouses.com</a>!</p>
      </div>
    </div>
  )
}

export const Controls = (props) => {
  const theControls = (
    <div id="controlsContainer">
      <div id="controls">
        <button id="startButton" onClick={props.click}>{props.buttonText}</button>
        <table><tbody>
          <tr>
            <td className="left">RECORD: </td>
            <td className="right">{props.recordSequenceLength}</td>
          </tr>
          <tr>
            <td className="left">CURRENT: </td>
            <td className="right">{props.currentSequenceLength}</td>
          </tr>
          <tr>
            <td className="left">PLAYER: </td>
            <td className="right">{props.playerSequenceLength}</td>
          </tr>
        </tbody></table>
        <div id="gm">GAME MODE</div>
        <button id="modeButton" onClick={props.switchMode}>{props.modeText}</button>
      </div>
    </div>
  )
  return theControls
}

export class MySvg extends React.Component {
  constructor (props) {
    super(props)
    // colors
    this.red0 = "#CC022B"
    this.red1 = "#FF4F78"
    this.yel0 = "#FFDB00"
    this.yel1 = "#FFFF4D"
    this.grn0 = "#3AA655"
    this.grn1 = "#87F3A2"
    this.blu0 = "#0066CC"
    this.blu1 = "#4DB3FF"
    this.m = 15 // margin around/between buttons
  }
  render() {
    // aliases for clarity
    let m = this.m // margin, top and left side button edge
    let w = this.props.w // window width
    let h = this.props.h // window height
    // Simon layout: upper left: green, upper right: red, lower left: yellow, lower right: blue
    let hls = (w - 3*m)/2 // horizontal long side
    let rse = w - m // right side button edge
    let bse = h - m // bottom side button edge
    // variables to carve an ellipse in the center
    let eVr = 110 // ellipse Vertical radius
    let eHr = eVr * 0.8 // ellipse Horizontal radius
    let xC = w/2 // x center (horizontal from left)
    let yC = h/2 // y center (vertical from top)
    // vertical short segment (from outer edge to ellipse intersection)
    let vss = yC - m - eVr*Math.cos(Math.asin(m/(2*eHr)))  
    // horizontal short segment (from outer button edge to ellipse intersection)
    let hCs = xC - m - eHr*Math.sin(Math.acos(m/(2*eVr)))  
    // end of arc points for each path
    let gyAh = m + hCs // green and yellow Arc horizontal endpoint
    let grAv = yC - m/2  // green and red Arc vertical endpoint  
    let brAh = rse - hCs // blue and red Arc horizontal endpoint
    let ybAv = yC + m/2  // yellow and blue Arc vertical endpoint  
    // when a panel is meant to display on (lit up) a letter is passed to it as a prop
    let red = (this.props.on === "r" || this.props.on === "all") ? this.red1 : this.red0
    let yel = (this.props.on === "y" || this.props.on === "all") ? this.yel1 : this.yel0
    let grn = (this.props.on === "g" || this.props.on === "all") ? this.grn1 : this.grn0
    let blu = (this.props.on === "b" || this.props.on === "all") ? this.blu1 : this.blu0
    // also when a panel is on we apply the "on" filter, if not "off"
    let filterG = (this.props.on === "g" || this.props.on === "all") ? "on" : "off"
    let filterR = (this.props.on === "r" || this.props.on === "all") ? "on" : "off"
    let filterB = (this.props.on === "b" || this.props.on === "all") ? "on" : "off"
    let filterY = (this.props.on === "y" || this.props.on === "all") ? "on" : "off"
    return (
      <svg width={w}
        height={h} className="butts"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <filter id="off">
          <feGaussianBlur stdDeviation="0" />
        </filter>
        <filter id="on">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        {/* green */}
        <path d = {`M ${m} ${m} h ${hls} v ${vss}  
          A ${eHr} ${eVr}, 0, 0, 0, ${gyAh} ${grAv} 
          h ${-hCs} Z`} filter={`url(#${filterG})`}
          fill={grn} onClick={() => this.props.click("g")}/>
        {/* red, upper right */}
        <path d = {`M ${rse} ${m} h ${-hls} v ${vss}
          A ${eHr} ${eVr}, 0, 0, 1, ${brAh} ${grAv}
          h ${hCs} Z`}  filter={`url(#${filterR})`}
          fill={red} onClick={() => this.props.click("r")}/>
        {/* yellow, lower left */}
        <path d = {`M ${m} ${bse} h ${hls} v ${-vss} 
          A ${eHr} ${eVr}, 0, 0, 1, ${gyAh} ${ybAv}
          h ${-hCs} Z`}  filter={`url(#${filterY})`}
          fill={yel} onClick={() => this.props.click("y")}/>
        {/* blue, lower right */}
        <path d = {`M ${rse} ${bse} h ${-hls} v ${-vss} 
          A ${eHr} ${eVr}, 0, 0, 0, ${brAh} ${ybAv}
          h ${hCs} Z`}  filter={`url(#${filterB})`}
          fill={blu} onClick={() => this.props.click("b")}/>
        {/*<ellipse cx={xC} cy={yC} rx={eHr - 16 } ry={eVr - 16}
          style={{fill: "#A55",stroke:"#CCC", strokeWidth:2}}*/} />
      </svg>
    )
  }
}