import React from 'react'

const choices = ["r","y","g","b"]

export const nextStep = () => {
  let next = Math.floor(Math.random()*4)
  return choices[next]
}

export class MySvg extends React.Component {
  constructor (props) {
    super(props)
    // colors
    this.red0 = "#CC022B"
    this.red1 = "#FF355E"
    this.yel0 = "#FFDB00"
    this.yel1 = "#FFFF66"
    this.grn0 = "#3AA655"
    this.grn1 = "#66FF66"
    this.blu0 = "#0066CC"
    this.blu1 = "#50BFE6"
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
    let eVr = h / 4 // ellipse Vertical radius
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
    let red = (this.props.on === "r") ? this.red1 : this.red0
    let yel = (this.props.on === "y") ? this.yel1 : this.yel0
    let grn = (this.props.on === "g") ? this.grn1 : this.grn0
    let blu = (this.props.on === "b") ? this.blu1 : this.blu0
    // also when a panel is on we apply the "on" filter, if not "off"
    let filterG = (this.props.on === "g") ? "on" : "off"
    let filterR = (this.props.on === "r") ? "on" : "off"
    let filterB = (this.props.on === "b") ? "on" : "off"
    let filterY = (this.props.on === "y") ? "on" : "off"
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
        {/*<ellipse cx={xC} cy={yC} rx={eHr -10 } ry={eVr - 10}
          style={{fill: "#FFF",stroke:"#CCC", strokeWidth:2}} />*/}
      </svg>
    )
  }
}