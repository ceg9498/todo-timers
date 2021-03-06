import React, { Component } from 'react';
import Welcome from './component/Welcome';
import Navbar from './component/Navbar';
import { setReset, checkResets } from './helpers/Reset';
import { initIDB, addOrUpdateOne, addOrUpdateMany, deleteOne } 
  from './data/data';
import { TimerType } from './data/schema';
import AddForm from './component/addForm';
import Options from './component/options';
import DisplayDialog from './component/DisplayDialog';
import DisplaySnack from './component/DisplaySnack';
import ListTimers from './component/ListTimers';
import './App.scss';

import Cookies from 'js-cookie';

/* Expansion Panel */
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Icon from '@material-ui/core/Icon';

import Typography from '@material-ui/core/Typography';

export default class App extends Component<any,any> {
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
      },
      newUser: false,
      loaded: false
    };
  }

  componentDidMount(){
    this.setup();
  }
  setup(){
    let cookies = Cookies.get();
    if(cookies.isUser){
      // user has been here before
      // refresh the cookie
      Cookies.set('isUser', 'true', { path: '', expires: 7 });
      // load their data
      initIDB.then((data:TimerType[])=>{
        this.setState({
          data:data,
          loaded: true
        });
        this.createTimeout(data);
        this.createCountdown();
        this.setCategories(data);
      }).catch(message => {
        this.openSnack(message);
      });
    } else {
      // otherwise, load the welcome popup
      this.setState({
        newUser: true,
        loaded: true
      })
    }
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
      } else {
        if(!categories.includes("No Category")){
          categories.push("No Category");
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
  
  clearActiveData = () => {
    // if a timeout exists, clear it
    if(this.state.timeout !== null){
      clearTimeout(this.state.timeout);
    }
    if(this.state.countdown !== null){
      clearInterval(this.state.countdown);
    }
    // reset the state regarding user data.
    // not resetting newUser, because I don't want the popup
    // to suddenly show up. It will appear on next load.
    this.setState({
      data:[],
      nextReset: null,
      timeout: null,
      countdown: null,
      categories: undefined,
      options: {
        hideCompleted: false,
        viewSlim: true,
      }
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
  };

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
  };

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
  
      this.setCategories(dataArr);

      this.setState({
        data: dataArr
      });
    }).catch((message)=>{
      //this.openSnack(message);
      console.log(message);
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
    let index:number;
    this.state.data.forEach((item,i) => {
      if(item.id === id){
        index = i;
      }
    });
    this.setState({
      dialog: {
        isOpen: true,
        id: index
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

  render() {
    let sectionId = {
      timers: 0,
      addTimer: 1,
      options: 2
    };
    return (
      <article id="article">
        {this.state.newUser &&
          <Welcome />
        }
        <Navbar 
          value={this.state.section} 
          handleTabChange={this.handleTabChange}
          categories={this.state.categories} />

        <Typography
          component="section"
          role="tabpanel"
          hidden={this.state.section !== sectionId.timers}
          id="top">

          {!this.state.loaded &&
            <LoadingDataDisplay />
          }
          {this.state.loaded && this.state.data.length === 0 &&
            <EmptyListDisplay />
          }

          {/* Required Timers */}
          {this.state.data.filter(item=>(item.required === true)).length > 0 &&
            <ExpansionPanel defaultExpanded={true}>
              <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                Important Timers
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ListTimers 
                  filtered={filterList(this.state.data, this.state.options.hideCompleted)
                    .filter(item=>(item.required === true))} 
                  handleChange={this.handleChange}
                  viewSlim={this.state.options.viewSlim}
                  openDialog={this.openDialog}
                  deleteItem={this.delete} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          }
        
          {/* Timers by Category */}
          {this.state.categories !== undefined && this.state.categories.map((category)=>
            <ExpansionPanel key={category}>
              <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                {category}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ListTimers 
                  filtered={filterList(this.state.data, this.state.options.hideCompleted)
                    .filter(item=>(item.category === category))} 
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
          hidden={this.state.section !== sectionId.addTimer}
          id="addTimer">
          <AddForm addTimer={this.addTimer} />
        </Typography>
        
        {/* Tab Panel for Options */}
        <Typography
          component="section"
          role="tabpanel"
          hidden={this.state.section !== sectionId.options}
          id="options">
          <h2>Options</h2>
          <Options 
            setOptions={this.setOptions} 
            optionsState={this.state.options} 
            clearData={this.clearActiveData}
            openSnack={this.openSnack} />
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

function filterList(data:TimerType[], hideCompleted:boolean){
  let filtered = data;
  if(hideCompleted){
    filtered = filtered.filter(item => !item.isCompleted);
  }
  return filtered;
}

function EmptyListDisplay(){
  return (
    <p>No timers yet! Create one by seleting "ADD TIMER" in the navigation bar.</p>
  );
};

function LoadingDataDisplay(){
  return (
    <span>Loading...</span>
  );
};