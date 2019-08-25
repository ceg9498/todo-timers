import React, { Component } from 'react';
import Navbar from './component/Navbar';
//import Popup from './component/Popup';
import Timer from './component/Timer';
import './App.scss';

const moment = require('moment');

function loadData(){
  let timerData = require('./data/timerdata.json');
  return timerData;
}

export default class TimerList extends Component<any,any> {
  constructor(props){
    super(props);
    this.state = {
      data:loadData(),
      reset: {
        day: "",
      },
      timer: {
        day: "",
      }
    };
    this.tick = this.tick.bind(this);
  }
  resetDayTime = moment().add(1,'days').hours(11).minutes(0);

  componentWillMount(){
    // 11 am Eastern, which is 1500 UTC
    let dayTimer = setInterval(this.tick, 60000);
    this.setState({
      reset: {day: this.resetDayTime.fromNow()},
      timer: {day: dayTimer}
    });
  }
  componentWillUnmount(){
    if(this.state.timer.day){
      clearInterval(this.state.timer.day);
    }
  }

  handleChange = (e:React.FormEvent<EventTarget>,index) => {
    let target = e.target as HTMLInputElement;
    let dates = [];

    // if dates exist in the completion list, set them to the temporary array
    if(this.state.data[index].completed){
        this.state.data[index].completed.forEach(date => {
            dates.push(date);
        });
    }
    // if the box is being checked, add the current date onto the end of the array
    if(target.checked === true){
      let date = moment().format('LL');
      dates.push(date);
    } else {
    // if the box is being unchecked, remove the last date from the end of the array
        dates.pop();
    }

    let tempData = this.state.data;
    tempData[index].completed = dates;
    tempData[index].isDone = target.checked;

    this.setState({
        data: tempData,
    });
  }

  tick(){
    console.log(this.resetDayTime.fromNow());
    let update = this.resetDayTime.fromNow();
    this.setState({
      reset: {day: update},
    });
  }
  
render() {
 return (
  <article id="root">
  <Navbar reset={this.state.reset} />

  <section id="top">
   <h2>Required Timers</h2>
   <p>This will be any timer marked as &quot;required&quot; that hasn&apos;t been completed for the specified time period</p>
   <p>For now, simply a testing sandbox area so I don't have to scroll/click a lot.</p>
   <div className="flex">
   {this.state.data.map((item,index) => { if(item.required === true){
     return(
       <div key={index}>
     <Timer
        key={index}
        index={index}
        name={item.name}
        frequency={item.frequency}
        required={item.required} 
        completed={item.completed}
        handleChange={this.handleChange}
        isDone={item.isDone} />
        </div>
     );
   } return(<></>) })}
    </div>
  </section>
  <section id="day">
   <h2>Daily Timers</h2>
   <p>This will be all timers that reset each day</p>
   <div className="flex">
   {this.state.data.map((item,index) => { if(item.frequency === "day"){
     return(
      <div key={index}>
     <Timer
        key={index}
        index={index}
        name={item.name}
        frequency={item.frequency}
        required={item.required} 
        completed={item.completed}
        handleChange={this.handleChange}
        isDone={item.isDone} />
        </div>
      );
   } return(<></>) })}
  </div>
  </section>
  <section id="week">
  <h2>Weekly Timers</h2>
  <p>This will be all timers that reset each week</p>
  <div className="flex">
  {this.state.data.map((item,index) => { if(item.frequency === "week"){
     return(
      <div key={index}>
     <Timer
        key={index}
        index={index}
        name={item.name}
        frequency={item.frequency}
        required={item.required} 
        completed={item.completed}
        handleChange={this.handleChange}
        isDone={item.isDone} />
        </div>
      );
   } return(<></>) })}
  </div>
  </section>
  <section id="other">
   <h2>Other Timers</h2>
   <p>This will be all timers that reset at a custom interval</p>
   <div className="flex">
   {this.state.data.map((item,index) => { if(item.frequency !== "day" && item.frequency !== "week"){
     return(
      <div key={index}>
     <Timer
        key={index}
        index={index}
        name={item.name}
        frequency={item.frequency}
        required={item.required} 
        completed={item.completed}
        handleChange={this.handleChange}
        isDone={item.isDone} />
        </div>
      );
   } return(<></>) })}
  </div>
  </section>
  </article>
 );
}
}
