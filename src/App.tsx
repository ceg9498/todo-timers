import React, { Component } from 'react';
import Navbar from './component/Navbar'
//import Popup from './component/Popup';
import Timer from './component/Timer';
import './App.scss';

function loadData(){
  let timerData = require('./data/timerdata.json');
  return timerData;
}

export default class TimerList extends Component<any,any> {
  constructor(props){
   super(props);
   this.state = {};
  }
  data = loadData();
  componentDidMount(){
  }
  
render() {
 return (
  <article id="root">
  <Navbar/>

  <section id="top">
   <h2>Required Timers</h2>
   <p>This will be any timer marked as &quot;required&quot; that hasn&apos;t been completed for the specified time period</p>
   <p>For now, simply a testing sandbox area so I don't have to scroll/click a lot.</p>
   {this.data.map((item,index) => 
     <Timer
        id={index}
        name={item.name}
        frequency={item.frequency}
        required={item.required} 
        completed={item.completed} />
   )}
  
  </section>
  <section id="day">
   <h2>Daily Timers</h2>
   <p>This will be all timers that reset each day</p>
  
  </section>
  <section id="week">
  <h2>Weekly Timers</h2>
  <p>This will be all timers that reset each week</p>
  
  </section>
  <section id="other">
   <h2>Other Timers</h2>
   <p>This will be all timers that reset at a custom interval</p>
  
  </section>
  </article>
 );
}
}
