import chai from 'chai'
import React from 'react'
import {Hello} from '../src/HelloComponent'
import {shallow} from 'enzyme'
let expect = chai.expect
describe("<Hello/>", ()=>{
    "use strict";
    it('renders one <h1> tag', ()=>{
        const wrapper = shallow(<Hello />);
        expect(wrapper.find('h1')).to.have.length(1)
    });
})