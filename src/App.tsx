import React, { Component } from 'react';
//import Popup from './component/Popup';
import Timer from './component/Timer';
import './App.scss';

export default class TimerList extends Component<any,any> {
  constructor(props){
   super(props);
   this.state = {};
  }
  componentDidMount(){
  }
  
render() {
  let test = {
    name: "Expert Roulette",
    frequency: "day",
    required: true,
    completed: new Date(2019,6,10),
  }
  
  let test2 = {
    name: "Alliance Raid Roulette",
    frequency: "day",
    required: false,
    completed: new Date(2019,6,15),
  }
 return (
  <article id="root">
  <nav id="navbar">
   <ul role="navigation">
    <li>
     <a href="#top" id="a-top">XIV Timers</a>
    </li><li>
     <a href="#day">Daily</a>
    </li><li>
     <a href="#week">Weekly</a>
    </li><li>
     <a href="#other">Other</a>
    </li>
   </ul>
  </nav>

  <section id="top">
   <h2>Required Timers</h2>
   <p>This will be any timer marked as &quot;required&quot; that hasn&apos;t been completed for the specified time period</p>
   <p>For now, simply a testing sandbox area so I don't have to scroll/click a lot.</p>
   <Timer 
      name={test.name} 
      frequency={test.frequency} 
      required={test.required} 
      completed={test.completed} />
   <Timer 
      name={test2.name} 
      frequency={test2.frequency} 
      required={test2.required} 
      completed={test2.completed} />
  
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
