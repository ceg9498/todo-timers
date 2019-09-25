import React, { Component } from 'react';
import { TimerType } from '../data/schema';
import './timer.scss';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

interface ITimer {
  data: TimerType,
  viewSlim: boolean,
  handleChange: Function,
  delete?: Function,
  edit?: Function,
  info?: Function
}

export default class Timer extends Component<ITimer,any> {
  constructor(props:ITimer){
    super(props);
    this.state = {};
  }

  completedBorderStyle = {
    borderColor: "#888",
  }
  completedBGStyle = {
    backgroundColor: "#888",
  }
  largePadStyle = {
    top: "-1px",
    width: "15px",
    height: "100px"
  }
  largeCardStyle = {
    height: "100px",
    alignItems: "start",
  }
  titleStyle = {
    width: "335px"
  }
  descriptionStyle = {
    overflowY: "auto"
  }
    
  render(){
    let timer = this.props.data;
    let viewSlim = this.props.viewSlim;
    let styles = {
      completedBorder: {},
      completedBG: {},
      card: {},
      pad: {},
      title: {},
      description: {},
    };
    if(!timer){
      return(<></>);
    }
    if(timer.isCompleted){
      styles.completedBorder = this.completedBorderStyle;
      styles.completedBG = this.completedBGStyle;
    }
    if(!viewSlim){
      styles.card = this.largeCardStyle;
      styles.pad = this.largePadStyle;
      styles.description = this.descriptionStyle;
      styles.title = this.titleStyle;
    }
    return(
      <div className="timerCard" style={{...styles.completedBorder,...styles.card}}>{/* whole card area */}
        <div 
          className="toggleArea"
          onClick={()=>(this.props.handleChange(timer.id))}>
          <div className="pad" style={{...styles.pad,...styles.completedBG}}>
            {/* Pad Area */}
          </div>
          <div className="titleArea" style={styles.title}> {/* Title Area */}
            <h6>
              {timer.required && 
                <span className="reqSym">&#x203C;&#xFE0F;&nbsp;</span>
              }
              {timer.title}
            </h6>
            {timer.countdown !== undefined && timer.countdown !== null ?
              <span className="date">In {timer.countdown}</span>
            : timer.completed.length > 0 ?
              <span className="date">Last completed: {timer.completed[timer.completed.length-1].toDateString()}</span>
            :
              <span className="date"></span>
            }
            {!viewSlim && timer.description !== undefined &&
              <div style={styles.description}>
                {timer.description}
              </div>
            }
          </div>
        </div>
        <div className="actionsArea"> {/* button area */}
          {viewSlim ?
            <IconButton 
              aria-label={timer.title + " Details"}
              onClick={()=>this.props.info(timer.id)}>
              <Icon className="info" >info</Icon>
            </IconButton>
          :
            <>
              <IconButton 
                aria-label={"Edit "+timer.title}
                onClick={()=>console.log("Edit Clicked")}>
                <Icon className="edit">edit</Icon>
              </IconButton>
              <IconButton 
                aria-label={"Delete "+timer.title}
                onClick={()=>this.props.delete(timer.id,"timerCard")}>
                <Icon className="delete">delete_forever</Icon>
              </IconButton>
            </>
          }
        </div>
      </div>
    );
  }
}