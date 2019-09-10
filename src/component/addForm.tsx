import React from 'react';
import { setReset } from '../helpers/Reset'

export default class AddForm extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {
      title: "",
      required: false,
      isCompleted: false,
      timerType: "regular",
      hour: 11,
      minute: 0,
      allDays: false,
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      unitValue: 1,
      unitType: "hours"
    };
  }

  handleChange = (event:any) => {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // cleanse hour/minute data
    if(name === "hour" || name === "minute"){
      if(typeof value !== "number"){
        value = 0;
      }
    }
    if(name === "hour"){
      value = parseInt(value);
      console.log("Hour value is: ",value)
      if(value < 0 || value > 24){
        console.error("Hour value is invalid", value)
        return
      } else if(value === undefined){
        value = 0;
      }
    } else if(name === "minute"){
      value = parseInt(value);
      console.log("Minute value is: ",value)
      if(value < 0 || value >= 60){
        console.error("Minute value is invalid", value)
        return
      } else if(value === undefined){
        value = 0;
      }
    }

    // setState for allDays is slightly more involved
    if(name === "allDays"){
      console.log("all days toggled");
      this.setState(()=>{
        return {
          sun: !this.state.sun,
          mon: !this.state.mon,
          tue: !this.state.tue,
          wed: !this.state.wed,
          thu: !this.state.thu,
          fri: !this.state.fri,
          sat: !this.state.sat
        }}
      );
    }
    this.setState({
      [name]: value
    });
  }

  intervalPeriod = () => {
    let period = 'i-' + this.state.unitValue + '-' + this.state.unitType;
    console.log(period);
    return period;
  }

  regularPeriod = () => {
    let period = 'r-0000-00-00-' + this.state.hour + '-' + this.state.minute + '-';
    period += this.calculateDayOfWeek();
    console.log(period);
    return period;
  }

  handleSubmit = (event:any) => {
    event.preventDefault();

    // calculate the reset period
    let period:String;
    if(this.state.timerType === "interval"){
      period = this.intervalPeriod();
    } else {
      period = this.regularPeriod();
    }

    let completed = []
    if(this.state.isCompleted){
      completed.push(new Date());
    }
    
    // create a TimerType object based on the forum input
    let timer = {
      id: 0, // this will be set for real in TimerList
      title: this.state.title,
      resetTime: setReset(period),
      required: this.state.required,
      completed: completed,
      isCompleted: this.state.isCompleted,
      period: period
    }
    this.props.addTimer(timer);
  }

  calculateDayOfWeek(){
    let DoW = "";
    if(this.state.allDays){
      DoW = "0123456";
    } else {
      if(this.state.sun){
        DoW += '0';
      }
      if(this.state.mon){
        DoW += '1';
      }
      if(this.state.tue){
        DoW += '2';
      }
      if(this.state.wed){
        DoW += '3';
      }
      if(this.state.thu){
        DoW += '4';
      }
      if(this.state.fri){
        DoW += '5';
      }
      if(this.state.sat){
        DoW += '6';
      }
    }
    return DoW;
  }

  render(){
  return(
    <form onSubmit={this.handleSubmit}>
      <label>Title:&nbsp;
        <input 
          type="text" 
          name="title"
          value={this.state.title}
          onChange={this.handleChange} />
      </label><br/>
      <label>
        <input 
          type="checkbox"
          name="required"
          value={this.state.required}
          onChange={this.handleChange} />
        Completion is Important or Required
      </label><br/>
      <label>
        <input 
          type="checkbox"
          name="isCompleted"
          value={this.state.isCompleted}
          onChange={this.handleChange} />
        Create as Completed
      </label><br/>
      <label>
        <input
          type="radio"
          name="timerType"
          value="regular"
          checked={this.state.timerType === "regular"}
          onChange={this.handleChange} />
        Regular Timer
      </label>
      <label>
        <input
          type="radio"
          name="timerType"
          value="interval"
          checked={this.state.timerType === "interval"}
          onChange={this.handleChange} />
        Interval Timer
      </label>
      {this.state.timerType === "regular" ?
      <fieldset>
        <legend>When should this timer reset?</legend>
          <label>
            <input 
              type="number"
              name="hour"
              min="0"
              max="24"
              value={this.state.hour}
              onChange={this.handleChange} />
          hours </label>:
          <label>
            <input 
              type="number"
              name="minute"
              min="0"
              max="59"
              value={this.state.minute}
              onChange={this.handleChange} />
          minutes</label>
          <br/>on<br/>
          <label>
            <input type="checkbox" name="allDays" checked={this.state.allDays}
              onChange={this.handleChange} />
            Toggle All Days
          </label><br/>
          <label>
            <input type="checkbox" name="sun" checked={this.state.sun}
              onChange={this.handleChange} />
            Sunday
          </label>
          <label>
            <input type="checkbox" name="mon" checked={this.state.mon}
              onChange={this.handleChange} />
            Monday
          </label>
          <label>
            <input type="checkbox" name="tue" checked={this.state.tue}
              onChange={this.handleChange} />
            Tuesday
          </label>
          <label>
            <input type="checkbox" name="wed" checked={this.state.wed}
              onChange={this.handleChange} />
            Wednesday
          </label>
          <label>
            <input type="checkbox" name="thu" checked={this.state.thu}
              onChange={this.handleChange} />
            Thursday
          </label>
          <label>
            <input type="checkbox" name="fri" checked={this.state.fri}
              onChange={this.handleChange} />
            Friday
          </label>
          <label>
            <input type="checkbox" name="sat" checked={this.state.sat}
              onChange={this.handleChange} />
            Saturday
          </label>
      </fieldset>
      :
      <fieldset>
        <legend>When should this timer reset?</legend>
        <label>
          <input 
            type="number" 
            name="unitValue"
            min="1"
            value={this.state.unitValue}
            onChange={this.handleChange} />
        </label>
        <label>
          <select
            name="unitType"
            value={this.state.unitType}
            onChange={this.handleChange}>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </label>
      </fieldset>
      }
      <input type="submit" value="Submit" />
    </form>
  );
}
}