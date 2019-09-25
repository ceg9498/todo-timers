import React, { Component } from 'react';
import Navbar from './component/Navbar';
import Timer from './component/Timer';
import { setReset, checkResets } from './helpers/Reset';
import { initIDB, addOrUpdateOne, addOrUpdateMany, deleteOne } 
  from './data/data';
import { TimerType } from './data/schema';
import AddForm from './component/addForm';
import Options from './component/options';
import './App.scss';

/* Expansion Panel */
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Icon from '@material-ui/core/Icon';

import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

/* Imports used for Slim UI's Info Dialog */
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

export default class TimerList extends Component<any,any> {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      nextReset: null,
      timeout: null,
      countdown: null,
      section:0,
      snack: {
        isOpen:false,
        message:"",
      },
      options: {
        hideCompleted: false,
        viewSlim: true,
      },
      dialog: {
        isOpen:false,
        id:null
      }
    };
  }

  componentWillMount(){
    initIDB.then((data:TimerType[])=>{
      this.setState({
        data:data
      });
      this.createTimeout(data);
      this.createCountdown();
      this.setCategories(data);
    }).catch(message => {
      this.openSnack(message);
    });
  }

  componentWillUnmount(){
    // if a timeout exists, clear it
    if(this.state.timeout !== null){
      clearTimeout(this.state.timeout);
    }
    if(this.state.countdown !== null){
      clearInterval(this.state.countdown);
    }
  }

  setCategories = (data:TimerType[]) => {
    let categories = [];
    data.forEach(item => {
      if(item.category !== ""){
        if(!categories.includes(item.category)){
          categories.push(item.category);
        }
      }
    });
    this.setState({
      categories: categories
    });
  };

  handleChange = (id:any) => {
    let data = this.state.data;

    // set the proper item to complete & add the current Date
    data.forEach(item=>{
      if(item.id === id){
        // set the item based on checkbox state
        item.isCompleted = !item.isCompleted;
        // if the checkbox IS checked, do extra steps
        if(item.isCompleted){
          item.completed.push(new Date());
          if(item.completed.length > 7){
            // if there are more than 7 date entries, remove the oldest
            item.completed.shift();
          }
          item.resetTime = setReset(item.period);
        } else {
          // if the checkbox IS NOT checked, remove the latest date & reset date
          item.completed.pop();
          item.countdown = null;
          item.resetTime = null;
        }
        addOrUpdateOne(item).then((message:string)=>{
          this.openSnack(message);
        }).catch((message:string)=>{
          this.openSnack(message);
        });
      }
    });
    // apply the new data to STATE
    this.setState({
      data:data
    });
    // re-create timeout based on the new data
    this.createTimeout(data);
  };

  delete = (id:any,source?:string) => {
    deleteOne(id).then((message:string)=>{
      this.openSnack(message);
      let data = [];
      this.state.data.forEach(entry => {
        if(entry.id !== id){
          data.push(entry);
        }
      });
      this.setCategories(data);
      this.setState({
        data:data
      });
      // other option is "timerCard"
      if(source === "dialog"){
        this.closeDialog(null);
      }
    }).catch((message:string)=>{
      this.openSnack(message);
    });
  };

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
      addOrUpdateMany(data).then(()=>{
        this.createTimeout(data);
        this.setState({
          data: data
        });
        if(hasReset === 1){
          this.openSnack("A timer has reset");
        } else {
          this.openSnack(hasReset + " timers have reset");
        }
      }).catch((message) => {
        this.openSnack(message);
      });
    }
  };

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
    let now = new Date();
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
  };

  createCountdown = () => {
    if(this.state.hideCompleted){
      return;
    };
    // clear an existing countdown before creating a new one
    if(this.state.countdown !== null){
      clearInterval(this.state.countdown);
    }
    // if the user has chosen to hide completed, don't create a timer
    if(this.state.hideCompleted){
      return;
    };
    // set interval to every 10 sec
    let intervalMS = 10000;

    let interval = setInterval(()=>this.tickCountdown(),intervalMS);
    // add interval to STATE
    this.setState({
      countdown:interval
    });
  }

  tickCountdown = () => {
    let now = new Date();
    let data = this.state.data;
    data.forEach(item=>{
      if(item.isCompleted){
        // set the data.countdown to be a string
        // representing the MS between now and timer
        let remainingMS = item.resetTime.valueOf() - now.valueOf();
        let dayMS = 1000 * 60 * 60 * 24;
        let hourMS = 1000 * 60 * 60;
        let minuteMS = 1000 * 60;
        let secondMS = 1000;
        let days = Math.floor(remainingMS / dayMS);
        remainingMS -= days * dayMS;
        let hours = Math.floor(remainingMS / hourMS);
        remainingMS -= hours * hourMS;

        // create the string next
        let cdString = "";

        if(days > 0){
          cdString += days + " days and ";
          if(hours > 0){
            cdString += hours + " hours";
          }
        } else {
          let minutes = Math.floor(remainingMS / minuteMS);
          remainingMS -= minutes * minuteMS;
          let seconds = Math.floor(remainingMS / secondMS);
          // don't care about anything remaining after seconds

          cdString += hours.toString().padStart(2,"0") + ":";
          cdString += minutes.toString().padStart(2,"0") + ":";
          cdString += seconds.toString().padStart(2,"0");
        }
        item.countdown = cdString;
      }
    });
    this.setState({
      data:data
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
    addOrUpdateOne(data).then((message:string)=>{
      this.openSnack(message);

      dataArr.push(data);
  
      let section = this.state.section;
      let categories = this.state.categories;
      if(data.category !== "" && !categories.includes(data.category)){
        this.setCategories(dataArr);
        section++;
      }
  
      this.setState({
        data: dataArr,
        displayAddForm: false,
        categories: categories,
        section: section
      });
    }).catch((message)=>{
      this.openSnack(message);
    });
  };

  handleTabChange = (event:any,newValue:number) => {
    this.setState({
      section:newValue
    });
  };

  openSnack = (message:string) => {
    this.setState({
      snack: {
        isOpen: true,
        message: message
      }
    });
  };

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
  };

  openDialog = (id:any) => {
    this.setState({
      dialog: {
        isOpen: true,
        id: id
      }
    });
  };

  closeDialog = (
    event:React.SyntheticEvent|React.MouseEvent,
    reason?:string) => {
    this.setState({
      dialog:{
        isOpen:false,
        id:null
      }
    });
  };

  setOptions = (event:any,name:string) => {
    let value = event.target.type === 'checkbox' ? 
      event.target.checked : 
      event.target.value;
    this.setState({
      options: {
        ...this.state.options,
        [name]: value,
      }
    });
    if(name === "hideCompleted"){
      if(value){
        clearInterval(this.state.countdown);
      } else {
        this.createCountdown();
      }
    }
  };

  filterList(){
    let filtered = this.state.data;
    if(this.state.options.hideCompleted){
      filtered = filtered.filter(item => !item.isCompleted);
    }
    return filtered;
  }

  render() {
    let addTimerSectionID = 1;
    let optionsSectionID = 2;
    return (
      <article id="root">
        <Navbar 
          value={this.state.section} 
          handleTabChange={this.handleTabChange}
          categories={this.state.categories} />

        <Typography
          component="section"
          role="tabpanel"
          hidden={this.state.section !== 0}
          id="top">

          {/* Required Timers */}
          <ExpansionPanel defaultExpanded={true}>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
              Important Timers
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ListTimers 
                filtered={this.filterList().filter(item=>(item.required === true))} 
                handleChange={this.handleChange}
                viewSlim={this.state.options.viewSlim}
                openDialog={this.openDialog}
                deleteItem={this.delete} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        
          {/* Timers by Category */}
          {this.state.categories !== undefined && this.state.categories.map((category,index)=>
            <ExpansionPanel key={category}>
              <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                {category}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ListTimers 
                  filtered={this.filterList().filter(item=>(item.category === category))} 
                  handleChange={this.handleChange}
                  viewSlim={this.state.options.viewSlim}
                  openDialog={this.openDialog}
                  deleteItem={this.delete} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </Typography>

        {/* Tab Panel for Adding a Timer */}
        <Typography
          component="section"
          role="tabpanel"
          hidden={this.state.section !== addTimerSectionID}
          id="addTimer">
          <AddForm addTimer={this.addTimer} />
        </Typography>
        
        {/* Tab Panel for Options */}
        <Typography
          component="section"
          role="tabpanel"
          hidden={this.state.section !== optionsSectionID}
          id="options">
          <h2>Options</h2>
          <Options setOptions={this.setOptions} optionsState={this.state.options} />
        </Typography>

        <DisplayDialog
          closeDialog={this.closeDialog}
          isOpen={this.state.dialog.isOpen}
          deleteItem={this.delete}
          timer={this.state.data[this.state.dialog.id]} />

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
  viewSlim:boolean,
  handleChange:Function,
  deleteItem:Function,
  openDialog:Function,
  editItem?:Function
}

function ListTimers(props:ITimerList){
  let { filtered, handleChange, deleteItem, viewSlim, openDialog } = props;
  if(viewSlim){
    return(
      <div className="flex">
        {filtered.map((item) => {
          return(
          <div key={item.id}>
            <Timer data={item} viewSlim={viewSlim} handleChange={handleChange} info={openDialog} />
          </div>
        );
        })}
      </div>
    );
  } else {
    return(
      <div className="flex">
        {filtered.map((item) => {
          return(
          <div key={item.id}>
            <Timer data={item} viewSlim={viewSlim} handleChange={handleChange} delete={deleteItem} />
          </div>
        );
        })}
      </div>
    );
  }
}

interface IDialog {
  closeDialog:any,
  isOpen:boolean,
  deleteItem:Function,
  editTimer?:any,
  timer:TimerType
}

function DisplayDialog(props:IDialog){
  if(props.timer === undefined){
    return(<></>);
  }
  let { closeDialog, isOpen, timer, deleteItem } = props;
  return(
    <Dialog 
      onClose={closeDialog}
      aria-labelledby="dialog-title"
      open={isOpen}>
        <DialogTitle id="dialog-title">
          {timer.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {timer.category}
          </DialogContentText>
          <DialogContentText>
            {timer.description}
          </DialogContentText>
          <DialogContentText>
            {timer.completed.length > 0 &&
              "Last completion: " +
              timer.completed[timer.completed.length-1].toLocaleString()
            }
            <br/>
            {timer.isCompleted &&
              "Next reset time: " +
              timer.resetTime.toLocaleString()
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>
            Close
          </Button>
          <Button onClick={()=>deleteItem(props.timer.id,"dialog")}>
            Delete
          </Button>
        </DialogActions>
    </Dialog>
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