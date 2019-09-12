import React from 'react';
import { setReset } from '../helpers/Reset'

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';

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
      partialDays: false,
      days: {
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false
      },
      unitValue: 1,
      unitType: "hours"
    };
  }

  handleChange = (event:any,name?:string) => {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;

    // check hour/minute values
    switch(name){
      case "hour":
        value = this.verifyUnit(parseInt(value),0,24);
        break;
      case "minute":
          value = this.verifyUnit(parseInt(value),0,59);
        break;
      case "unitValue":
          value = this.verifyUnit(parseInt(value),1);
        break;
    }

    // setState for certain items is more involved
    switch(name){
      case "allDays":
      case "sun":
      case "mon":
      case "tue":
      case "wed":
      case "thu":
      case "fri":
      case "sat":
        this.checkDaysState(name, value);
        break;
      default:
        this.setState({
          [name]: value
        });
    }
  }

  verifyUnit(value:number,min:number,max?:number):number{
    if(value < min){
      return min;
    } else if(value > max){
      return max;
    } else if(Number.isNaN(value)){
      return min;
    }
    console.log("Unit value is: ",value);
    return value;
  }

  checkDaysState = (name, value) => {
    let daysObj = this.state.days;
    let valuesArr = [];
    if(name === "allDays"){
      console.log("all days toggled");
      // for "allDays":
      // flip each day's value (true/false)
      daysObj = {
        sun:!daysObj.sun,
        mon:!daysObj.mon,
        tue:!daysObj.tue,
        wed:!daysObj.wed,
        thu:!daysObj.thu,
        fri:!daysObj.fri,
        sat:!daysObj.sat
      }
    } else {
      // otherwise it will be an individual day, so set that to the "value"
      daysObj[name] = value;
    }
    // next, create an array out of the object
    // this allows easy checking for partial
    valuesArr = [
      daysObj.sun,
      daysObj.mon,
      daysObj.tue,
      daysObj.wed,
      daysObj.thu,
      daysObj.fri,
      daysObj.sat
    ];

    console.log(valuesArr);
    
    // check if days are all true (none are false)
    if(!valuesArr.includes(false)){
      // then set allDays to true-determinate
      this.setState({
        days:daysObj,
        allDays:true,
        partialDays:false
      });
    }
    // check if days are all false (none are true)
    else if(!valuesArr.includes(true)){
      // then set allDays to false-determinate
      this.setState({
        days:daysObj,
        allDays:false,
        partialDays:false
      });
    }
    // otherwise, set allDays to true-indeterminate
    else {
      this.setState({
        days:daysObj,
        allDays:true,
        partialDays:true
      });
    }
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
    <form autoComplete="off">
      <TextField required
        id="timer-name"
        name="title"
        label="Title"
        className="textField"
        margin="normal"
        onChange={(e)=>this.handleChange(e,"title")} /><br/>

      <FormControlLabel control={
        <Switch checked={this.state.required} onChange={(e)=>this.handleChange(e,"required")} />
      } label="Important" /><br/>
      <FormControlLabel control={
        <Switch checked={this.state.isCompleted} onChange={(e)=>this.handleChange(e,"isCompleted")} />
      } label="Create as Completed" /><br/>
      
      <FormControl component="fieldset" className="temp">
        <FormLabel component="legend">Timer Type</FormLabel>
        <RadioGroup name="timerType" value={this.state.timerType} onChange={(e)=>this.handleChange(e,"timerType")}>
            <FormControlLabel value="regular" control={<Radio />} label="Regular" />
            <FormControlLabel value="interval" control={<Radio />} label="Interval" />
        </RadioGroup>
      </FormControl>

      {this.state.timerType === "regular" ?
        <>
          <FormLabel component="legend">When should this timer reset?</FormLabel>

          <FormControlLabel control={
            <Input required
              id="regular-hour"
              type="number"
              name="hour"
              value={this.state.hour}
              onChange={(e)=>this.handleChange(e,"hour")} />
          } label="hours" />
          <br/>
          <FormControlLabel control={
            <Input required
              id="regular-minute"
              type="number"
              name="minute"
              value={this.state.minute}
              onChange={(e)=>this.handleChange(e,"minute")} />
          } label="minutes" /><br/>

          <FormControlLabel control={this.state.partialDays ?
            <Checkbox 
              indeterminate
              checked={this.state.allDays} 
              onChange={(e)=>this.handleChange(e,"allDays")}/>
          :
            <Checkbox 
              checked={this.state.allDays} 
              onChange={(e)=>this.handleChange(e,"allDays")}/>
          } label="Toggle All Days" /><br/>
          <FormControlLabel control={
              <Checkbox checked={this.state.days.sun} onChange={(e)=>this.handleChange(e,"sun")}/>
          } label="Sunday" /><br/>
          <FormControlLabel control={
              <Checkbox checked={this.state.days.mon} onChange={(e)=>this.handleChange(e,"mon")}/>
          } label="Monday" /><br/>
          <FormControlLabel control={
              <Checkbox checked={this.state.days.tue} onChange={(e)=>this.handleChange(e,"tue")}/>
          } label="Tuesday" /><br/>
          <FormControlLabel control={
              <Checkbox checked={this.state.days.wed} onChange={(e)=>this.handleChange(e,"wed")}/>
          } label="Wednesday" /><br/>
          <FormControlLabel control={
              <Checkbox checked={this.state.days.thu} onChange={(e)=>this.handleChange(e,"thu")}/>
          } label="Thursday" /><br/>
          <FormControlLabel control={
              <Checkbox checked={this.state.days.fri} onChange={(e)=>this.handleChange(e,"fri")}/>
          } label="Friday" /><br/>
          <FormControlLabel control={
              <Checkbox checked={this.state.days.sat} onChange={(e)=>this.handleChange(e,"sat")}/>
          } label="Saturday" /><br/>
      </>
      :
      <>
        <FormLabel component="legend">When should this timer reset?</FormLabel>
        <FormControlLabel control={
          <Input required
            id="interval-unit-value"
            type="number"
            name="unitValue"
            value={this.state.unitValue}
            onChange={(e)=>this.handleChange(e,"unitValue")} />
        } label={this.state.unitType} />
        
        <InputLabel htmlFor="unitType">Time Period</InputLabel>
        <Select
          native
          value={this.state.unitType}
          onChange={(e)=>this.handleChange(e,"unitType")}
          inputProps={{
            name: 'period',
            id: 'interval-period',
          }}
        >
          <option value="minutes">minutes</option>
          <option value="hours">hours</option>
          <option value="days">days</option>
        </Select>
      </>
      }
      <br/>
      <Button variant="contained" onClick={this.handleSubmit}>
        Submit
      </Button>
    </form>
  );
}
}