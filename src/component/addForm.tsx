import React from 'react';
import { setReset } from '../helpers/Reset';

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
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';

export default class AddForm extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {
      title: "",
      required: false,
      isCompleted: false,
      timerType: "regular",
      useGlobalTime: true,
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
      unitType: "hours",
      description: "",
      category: ""
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
  };

  clearForm = () => {
    this.setState({
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
      unitType: "hours",
      description: "",
      category: ""
    });
  };

  verifyUnit(value:number,min:number,max?:number):number{
    if(value < min){
      return min;
    } else if(value > max){
      return max;
    } else if(Number.isNaN(value)){
      return min;
    }
    return value;
  }

  checkDaysState = (name, value) => {
    let daysObj = this.state.days;
    let valuesArr = [];
    if(name === "allDays"){
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
      };
    } else {
      // otherwise it will be an individual day,
      // so set that to the "value"
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
  };

  intervalPeriod = () => {
    let period = 'i.';
    period += this.state.unitValue + '.';
    period += this.state.unitType;
    return period;
  };

  regularPeriod = () => {
    let period = '';
    if(this.state.useGlobalTime){
      period = 'rg.0000.00.00.';
      let offsetTotal = (new Date()).getTimezoneOffset();
      let offsetHours = Math.floor(offsetTotal/60);
      let offsetMinutes = offsetTotal-(offsetHours*60);
      period += (this.state.hour+offsetHours) + '.';
      period += (this.state.minute+offsetMinutes) + '.';
    } else {
      period = 'rl.0000.00.00.';
      period += this.state.hour + '.';
      period += this.state.minute + '.';
    }
    period += this.calculateDayOfWeek();
    return period;
  };

  handleSubmit = (event:any) => {
    event.preventDefault();

    // calculate the reset period
    let period:String;
    if(this.state.timerType === "interval"){
      period = this.intervalPeriod();
    } else {
      period = this.regularPeriod();
    }

    let completed = [];
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
      period: period,
      description: this.state.description,
      category: this.state.category,
    };
    this.props.addTimer(timer);
  };

  calculateDayOfWeek(){
    let DoW = "";
    if(this.state.days.sun){
      DoW += '0';
    }
    if(this.state.days.mon){
      DoW += '1';
    }
    if(this.state.days.tue){
      DoW += '2';
    }
    if(this.state.days.wed){
      DoW += '3';
    }
    if(this.state.days.thu){
      DoW += '4';
    }
    if(this.state.days.fri){
      DoW += '5';
    }
    if(this.state.days.sat){
      DoW += '6';
    }
    return DoW;
  }

  render(){
    return(
      <form autoComplete="off">
        <h2>Create a Timer</h2>
        <div className="basic-info">
          <TextField required
            id="timer-name"
            name="title"
            label="Title"
            className="timer-name-field"
            value={this.state.title}
            margin="normal"
            onChange={(e)=>this.handleChange(e,"title")} />

          <TextField 
            id="timer-category"
            name="category"
            label="Category"
            className="timer-category-field"
            value={this.state.category}
            margin="normal"
            onChange={(e)=>this.handleChange(e,"category")} />

          <FormControlLabel control={
            <Switch checked={this.state.required} onChange={(e)=>this.handleChange(e,"required")} />
          } label="Important" className="important-field" />
          <FormControlLabel control={
            <Switch checked={this.state.isCompleted} onChange={(e)=>this.handleChange(e,"isCompleted")} />
          } label="Create as Completed" className="completed-field" />
          
          <FormControl component="fieldset" className="timer-type-field">
            <FormLabel component="legend">Timer Type</FormLabel>
            <RadioGroup name="timerType" value={this.state.timerType} onChange={(e)=>this.handleChange(e,"timerType")}>
                <FormControlLabel value="regular" control={<Radio />} label="Scheduled" />
                <FormControlLabel value="interval" control={<Radio />} label="Repeating" />
            </RadioGroup>
          </FormControl>

        </div>
        <div className="specific-info">
          {this.state.timerType === "regular" ?
            <>
              <FormLabel component="legend">When should this timer reset?</FormLabel>

              <div className="time-input">
                <FormControlLabel control={
                  <Input required
                    id="regular-hour"
                    type="number"
                    name="hour"
                    value={this.state.hour}
                    onChange={(e)=>this.handleChange(e,"hour")} />
                } label="&nbsp;hour" />and&nbsp;&nbsp;&nbsp;&nbsp;
                <FormControlLabel control={
                  <Input required
                    id="regular-minute"
                    type="number"
                    name="minute"
                    value={this.state.minute}
                    onChange={(e)=>this.handleChange(e,"minute")} />
                } label="&nbsp;minutes" />
              </div>

              <Tooltip 
                placement="right"
                title="Recommended for events that happen on a global scale. Disable this option if it is for local events.">
                <FormControlLabel control={
                  <Switch checked={this.state.useGlobalTime} onChange={(e)=>this.handleChange(e,"useGlobalTime")} />
                } label="Ignore changes from Daylight Savings Time" />
              </Tooltip>

              <br/>

              <FormControlLabel control=
                {this.state.partialDays ?
                  <Checkbox 
                    indeterminate
                    checked={this.state.allDays} 
                    onChange={(e)=>this.handleChange(e,"allDays")}/>
                :
                  <Checkbox 
                    checked={this.state.allDays} 
                    onChange={(e)=>this.handleChange(e,"allDays")}/>
                } label="Toggle All Days" />
              <div className="days-input">
                <FormControlLabel control={
                    <Checkbox checked={this.state.days.mon} onChange={(e)=>this.handleChange(e,"mon")}/>
                } label="Monday" />
                <FormControlLabel control={
                    <Checkbox checked={this.state.days.tue} onChange={(e)=>this.handleChange(e,"tue")}/>
                } label="Tuesday" />
                <FormControlLabel control={
                    <Checkbox checked={this.state.days.wed} onChange={(e)=>this.handleChange(e,"wed")}/>
                } label="Wednesday" />
                <FormControlLabel control={
                    <Checkbox checked={this.state.days.thu} onChange={(e)=>this.handleChange(e,"thu")}/>
                } label="Thursday" />
                <FormControlLabel control={
                    <Checkbox checked={this.state.days.fri} onChange={(e)=>this.handleChange(e,"fri")}/>
                } label="Friday" />
                <FormControlLabel control={
                    <Checkbox checked={this.state.days.sat} onChange={(e)=>this.handleChange(e,"sat")}/>
                } label="Saturday" />
                <FormControlLabel control={
                    <Checkbox checked={this.state.days.sun} onChange={(e)=>this.handleChange(e,"sun")}/>
                } label="Sunday" />
              </div>
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
                  onChange={(e)=>this.handleChange(e,"unitValue")} className="time-input" />
              } label={this.state.unitType} />
          
              <InputLabel htmlFor="unitType">Time Period</InputLabel>
              <Select
                native
                value={this.state.unitType}
                onChange={(e)=>this.handleChange(e,"unitType")}
                inputProps={{
                  name: 'period',
                  id: 'interval-period',
                }}>
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
              </Select>
            </>
          }
        </div>
        
        <TextField multiline fullWidth
            id="timer-description"
            name="description"
            label="Description"
            className="timer-description-field"
            value={this.state.description}
            margin="normal"
            onChange={(e)=>this.handleChange(e,"description")} />

        <br/>
        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
          Submit
        </Button>&nbsp;
        <Button variant="contained" onClick={this.clearForm}>
          Clear
        </Button>
      </form>
    );
  }
}