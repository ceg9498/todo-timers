import React from 'react';
import { setReset } from '../helpers/Reset'

export default class AddForm extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {
      title: "",
      required: false,
      isCompleted: false,
      hours: "11",
      minutes: "00",
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false
    };
  }

  handleChange = (event:any) => {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // cleanse hour/minute data
    if(name === "hour"){
      value = parseInt(value);
      console.log("Hour value is: ",value)
      if(value < 0 || value > 24){
        console.error("Hour value is invalid", value)
        return
      } else if(value === 0){
        value = "00"
      }
    } else if(name === "minute"){
      value = parseInt(value);
      console.log("Minute value is: ",value)
      if(value < 0 || value >= 60){
        console.error("Minute value is invalid", value)
        return
      } else if(value === 0){
        value = "00"
      }
    }
    // Day of Week data is calculated/formatted in calculateDayOfWeek()

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event:any) => {
    event.preventDefault();

    // calculate the reset period
    let period = 'r-0000-00-00-' + this.state.hour + '-' + this.state.minute + '-';
    period += this.calculateDayOfWeek();
    console.log(period);

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
    return DoW;
  }

  render(){
  return(
    <form onSubmit={this.handleSubmit}>
      <label>Title: 
        <input 
          type="text" 
          name="title"
          value={this.state.title}
          onChange={this.handleChange} />
      </label>
      <label>Required?
        <input 
          type="checkbox"
          name="required"
          value={this.state.required}
          onChange={this.handleChange} />
      </label>
      <label>Completed today?
        <input 
          type="checkbox"
          name="isCompleted"
          value={this.state.isCompleted}
          onChange={this.handleChange} />
      </label>
      <fieldset>
        <legend>When should this timer reset?</legend>
          <label>
            <input 
              type="number"
              name="hour"
              value={this.state.hour}
              onChange={this.handleChange} />
          hours </label>:
          <label>
            <input 
              type="number"
              name="minute"
              value={this.state.minute}
              onChange={this.handleChange} />
          minutes</label>
          <br/>on<br/>
          <label>Sunday
            <input type="checkbox" name="sun" value={this.state.sun}
          onChange={this.handleChange} />
          </label>
          <label>Monday
            <input type="checkbox" name="mon" value={this.state.mon}
          onChange={this.handleChange} />
          </label>
          <label>Tuesday
            <input type="checkbox" name="tue" value={this.state.tue}
          onChange={this.handleChange} />
          </label>
          <label>Wednesday
            <input type="checkbox" name="wed" value={this.state.wed}
          onChange={this.handleChange} />
          </label>
          <label>Thursday
            <input type="checkbox" name="thu" value={this.state.thu}
          onChange={this.handleChange} />
          </label>
          <label>Friday
            <input type="checkbox" name="fri" value={this.state.fri}
          onChange={this.handleChange} />
          </label>
          <label>Saturday
            <input type="checkbox" name="sat" value={this.state.sat}
          onChange={this.handleChange} />
          </label>
      </fieldset>
      <input type="submit" value="Submit" />
    </form>
  );
}
}