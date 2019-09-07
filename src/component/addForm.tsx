import React from 'react';
import { setReset } from '../helpers/Reset'

export default class AddForm extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {};
  }

  handleChange = (event:any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // cleanse data here(?)

    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event:any) => {
    event.preventDefault();

    // calculate the reset period
    let period = 'r-0000-00-00-' + this.state.hour + '-' + this.state.minute + '-';
    period += this.calculateDayOfWeek();
    
    // create a TimerType object based on the forum input
    let timer = {
      id: 0, // this will be set for real in TimerList
      title: this.state.title,
      resetTime: setReset(period),
      required: this.state.required,
      completed: [],
      isCompleted: this.state.isCompleted,
      period: period
    }
    this.props.addTimer(timer);
  }

  calculateDayOfWeek(){
    let DoW:String;
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
          value=""
          placeholder="A Title for Your Timer" />
      </label>
      <label>Required?
        <input 
          type="checkbox"
          name="required"
          value="" />
      </label>
      <label>Completed today?
        <input 
          type="checkbox"
          name="isCompleted"
          value="" />
      </label>
      <fieldset>
        <legend>When should this timer reset?
          <label>
            <input 
              type="number"
              name="hour"
              value="" />
          hours </label>:
          <label>
            <input 
              type="number"
              name="minute"
              value="" />
          minutes</label>
          <br/>on<br/>
          <label>Sunday
            <input type="checkbox" name="sun" value="" />
          </label>
          <label>Monday
            <input type="checkbox" name="mon" value="" />
          </label>
          <label>Tuesday
            <input type="checkbox" name="tue" value="" />
          </label>
          <label>Wednesday
            <input type="checkbox" name="wed" value="" />
          </label>
          <label>Thursday
            <input type="checkbox" name="thu" value="" />
          </label>
          <label>Friday
            <input type="checkbox" name="fri" value="" />
          </label>
          <label>Saturday
            <input type="checkbox" name="sat" value="" />
          </label>
        </legend>
      </fieldset>
      <input type="submit" value="Submit" />
    </form>
  );
}
}