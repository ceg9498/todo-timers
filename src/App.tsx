import React, { Component } from 'react';
import Navbar from './component/Navbar';
import Timer from './component/Timer';
import { getReset, setReset, checkResets } from './helpers/Reset'
import { initIDB, loadData, filterData } from './data/data'
import { TimerType } from './data/schema'
import './App.scss';

const emptyTimer = {
  id: -1,
  title: '',
  resetTime: null,
  required: false,
  completed: [],
  isCompleted: false,
  period: '',
};

export default class TimerList extends Component<any,any> {
  constructor(props){
    super(props);
    this.state = {
      data:[emptyTimer],
      reset: {
        day: getReset("day"),
        week: getReset("week")
      }
    };
  }

  componentWillMount(){
    initIDB.then(()=>{
      loadData.then((data:TimerType[])=>{
        this.setState({
          data:filterData(data)
        });
      }).catch((error)=>{
        console.error("Error loading data from IndexedDB: ",error);
      });
    }).catch(error => {
      console.error("Error opening IndexedDB: ", error);
      // on error, set state.data to an empty timer object
    });
  }

  handleChange = (e:React.FormEvent<EventTarget>,id) => {
    let target = e.target as HTMLInputElement;
    let data = this.state.data;

    // set the proper item to complete & add the current Date
    data.forEach(item=>{
      if(item.id === id){
        // set the item based on checkbox state
        item.isCompleted = target.checked;
        // if the checkbox IS checked, do extra steps
        if(target.checked){
          item.completed.push(new Date());
          if(item.completed.length > 7){
            // if there are more than 7 date entries, remove the oldest
            item.completed.shift();
          }
          item.resetTime = setReset(item.period);
          console.log(item.resetTime.toJSON());
          console.log(item.completed[item.completed.length-1].toJSON());
        } else {
          // if the checkbox IS NOT checked, remove the latest date & reset date
          item.completed.pop();
          item.resetTime = null;
        }
      }
    });
    // apply the new data to STATE
    this.setState({
      data:data
    });
    console.log("Changed data: ",data);
  }

  handleResetCheck = () => {
    let data = this.state.data;
    data.forEach(item => {
      if(item.isCompleted === true && checkResets(item.resetTime)){
        item.resetTime = null;
        item.isCompleted = false;
      }
    });
    this.setState({
      data: data
    });
  }
  
render() {
  console.log(this.state.reset);
  if(this.state.data === null || this.state.data === undefined){
    return(<></>);
  }
 return (
  <article id="root">
  <Navbar />

  <section id="top">
   <h2>Required Timers</h2>
   <p>This will be any timer marked as &quot;required&quot; that hasn&apos;t been completed for the specified time period</p>
   <p>For now, simply a testing sandbox area so I don't have to scroll/click a lot.</p>
   <button onClick={this.handleResetCheck}>Check for Reset Items</button>
   <div className="flex">
   {this.state.data/*.filter(item => item.required===true)*/.map((item) => {
     return(
      <div key={item.id}>
        <Timer {...item} handleChange={this.handleChange} />
      </div>
     );
   })}
    </div>
  </section>
  <section id="day">
   <h2>Daily Timers</h2>
   <p>This will be all timers that reset each day</p>
   <div className="flex">
   {this.state.data.filter(item=>item.frequency === "day").map((item,index) => {
     return(
      <div key={index}>
        <Timer index={index} {...item} handleChange={this.handleChange} />
      </div>
    );
    })}
  </div>
  </section>
  <section id="week">
  <h2>Weekly Timers</h2>
  <p>This will be all timers that reset each week</p>
  <div className="flex">
  {this.state.data.filter(item=>item.frequency === "week").map((item,index) => {
    return(
      <div key={index}>
        <Timer index={index} {...item} handleChange={this.handleChange} />
      </div>
    );
   })}
  </div>
  </section>
  <section id="other">
   <h2>Other Timers</h2>
   <p>This will be all timers that reset at a custom interval</p>
   <div className="flex">
   {this.state.data.filter(item=>(item.frequency !== "day" && item.frequency !== "week")).map((item,index) => {
     return(
      <div key={index}>
        <Timer index={index} {...item} handleChange={this.handleChange} />
      </div>
    );
   })}
  </div>
  </section>
  </article>
 );
}
}
