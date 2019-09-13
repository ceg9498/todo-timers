import React, { Component } from 'react';
import Navbar from './component/Navbar';
import Timer from './component/Timer';
import { setReset, checkResets } from './helpers/Reset'
import { initIDB, loadData, filterData, addOrUpdateOne, addOrUpdateMany, deleteOne } from './data/data'
import { TimerType } from './data/schema'
import AddForm from './component/addForm'
import './App.scss';

import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

export default class TimerList extends Component<any,any> {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      nextReset: null,
      timeout: null,
      displayAddForm: false,
      section:0,
      snack: {
        isOpen:false,
        message:""
      }
    };
  }

  componentWillMount(){
    initIDB.then(()=>{
      loadData.then((data:TimerType[])=>{
        this.setState(()=>{
          return {data:filterData(data)}
        });
        this.createTimeout(data);
      }).catch((error)=>{
        console.error("Error loading data from IndexedDB: ",error);
      });
    }).catch(error => {
      console.error("Error opening IndexedDB: ", error);
    });
  }

  componentWillUnmount(){
    // if a timeout exists, clear it
    if(this.state.timeout !== null){
      clearTimeout(this.state.timeout);
    }
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
        } else {
          // if the checkbox IS NOT checked, remove the latest date & reset date
          item.completed.pop();
          item.resetTime = null;
        }
        addOrUpdateOne(item);
      }
    });
    // apply the new data to STATE
    this.setState({
      data:data
    });
    // re-create timeout based on the new data
    this.createTimeout(data);
  }

  delete = (id:any) => {
    deleteOne(id);
    let data = [];
    this.state.data.forEach(entry => {
      if(entry.id !== id){
        data.push(entry);
      }
    });
    this.setState({
      data:data
    });
  }

  handleReset = () => {
    let hasReset = 0;
    let data = this.state.data;
    data.forEach(item => {
      if(item.isCompleted === true && checkResets(item.resetTime)){
        item.resetTime = null;
        item.isCompleted = false;
        hasReset++;
      }
    });
    if(hasReset > 0){
      addOrUpdateMany(data);
      this.createTimeout(data);
      this.setState({
        data: data
      });
      if(hasReset === 1){
        this.setState({
          snack:{
            isOpen:true,
            message:"A timer has reset"
          }
        });
      } else {
        let msg = hasReset + " timers have reset";
        this.setState({
          snack:{
            isOpen:true,
            message:msg
          }
        });
      }
    }
  }

  createTimeout = (data?:TimerType[]) => {
    // clear an existing timeout before creating a new one
    if(this.state.timeout !== null){
      clearTimeout(this.state.timeout);
    }
    // if no data variable was passed, use state's data
    if(data === undefined){
      data = this.state.data;
    }
    // set default MS to 24h
    let timeoutMS = 24 * 60 * 60 * 1000;
    // nextReset will hold the date of the next timeout check
    let nextReset:Date;
    let now = new Date()
    data.forEach(item=>{
      if(item.isCompleted){
        if((item.resetTime.valueOf()-now.valueOf()) < timeoutMS){
          // set the timeoutMS to be the MS between now and timer
          timeoutMS = item.resetTime.valueOf() - now.valueOf();
          nextReset = item.resetTime;
        }
      }
    });
    // add 10 seconds to timeoutMS for a buffer period
    timeoutMS += 10000;
    let timeout = setTimeout(()=>this.handleReset(),timeoutMS);
    // add data, timeout, and nextReset to STATE
    this.setState({
      nextReset:nextReset,
      timeout:timeout
    });
  }

  addTimer = (data:TimerType) => {
    let dataArr = this.state.data;
    // add an id to the data
    let nID = 0;
    // check if nID exists in the data already
    let ids = [];
    dataArr.forEach(item=>{
      ids.push(item.id);
    });
    while(ids.includes(nID)){
      nID++;
    }
    data.id = nID;
    addOrUpdateOne(data);
    dataArr.push(data);

    this.setState({
      data: dataArr,
      displayAddForm: false,
      snack: {
        isOpen: true,
        message: "Timer added"
      }
    });
  }

  displayAddForm = () => {
    this.setState({
      displayAddForm: true
    });
  }

  handleTabChange = (event:any,newValue:number) => {
    this.setState({
      section:newValue
    });
  }

  closeSnack = (
    event:React.SyntheticEvent|React.MouseEvent,
    reason?:string) => {
    // reason can be "clickaway" or "timeout"
    this.setState({
      snack: {
        isOpen:false,
        message:""
      }
    });
  }

render() {
  console.log("Next Reset: ",this.state.nextReset)
 return (
  <article id="root">
    <Navbar value={this.state.section} handleTabChange={this.handleTabChange} />

    <Typography
      component="section"
      role="tabpanel"
      hidden={this.state.section !== 0}
      id="top">
      <h2>All Timers</h2>
      <p>This will be all timers</p>
      <ListTimers 
        filtered={this.state.data} 
        handleChange={this.handleChange}
        deleteItem={this.delete} />
    </Typography>

    <Typography
      component="section"
      role="tabpanel"
      hidden={this.state.section !== 1}
      id="top">
      <h2>Required Timers</h2>
      <p>This will be any timer marked as &quot;required&quot; that hasn&apos;t been completed for the specified time period</p>
      <ListTimers 
        filtered={this.state.data.filter(item=>(item.required === true))} 
        handleChange={this.handleChange}
        deleteItem={this.delete} />
    </Typography>

    <Typography
      component="section"
      role="tabpanel"
      hidden={this.state.section !== 2}
      id="scheduled">
      <h2>Scheduled</h2>
      <p>This will be all timers that reset each day</p>
      <ListTimers 
        filtered={this.state.data.filter(item=>(item.period[0] === 'r'))} 
        handleChange={this.handleChange}
        deleteItem={this.delete} />
    </Typography>
    
    <Typography
      component="section"
      role="tabpanel"
      hidden={this.state.section !== 3}
      id="repeating">
      <h2>Repeating</h2>
      <p>This will be all timers that reset at a custom interval</p>
      <ListTimers 
        filtered={this.state.data.filter(item=>(item.period[0] === 'i'))} 
        handleChange={this.handleChange}
        deleteItem={this.delete} />
    </Typography>
    
    <Typography
      component="section"
      role="tabpanel"
      hidden={this.state.section !== 4}
      id="addTimer">
      <AddForm addTimer={this.addTimer} />
    </Typography>

    <DisplaySnack 
      isSnackOpen={this.state.snack.isOpen} 
      message={this.state.snack.message}
      closeSnack={this.closeSnack} />
  </article>
 );
}
}

interface ITimerList {
  filtered:Array<TimerType>,
  handleChange:Function,
  deleteItem:Function
}

function ListTimers(props:ITimerList){
  let { filtered, handleChange, deleteItem } = props;
  return(
    <div className="flex">
      {filtered.map((item) => {
        return(
         <div key={item.id}>
           <Timer data={item} handleChange={handleChange} delete={deleteItem} />
         </div>
       );
      })}
    </div>
  );
}

interface ISnack {
  isSnackOpen:boolean,
  message:string,
  closeSnack:any
}
function DisplaySnack(props:ISnack){
  let { isSnackOpen, message, closeSnack } = props;
  return(
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={isSnackOpen}
      autoHideDuration={6000}
      onClose={closeSnack}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{message}</span>}
    />
  );
}