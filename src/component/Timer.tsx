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

  checkedCard = {
    WebkitFilter: "grayscale(100%)", /* Safari 6.0 - 9.0 */
    filter: "grayscale(100%)",
  }
    
  render(){
    let timer = this.props.data;
    let viewSlim = this.props.viewSlim;
    let timerCard;
    if(!timer){
      return(<></>);
    }
    if(timer.isCompleted){
      timerCard = this.checkedCard;
    }
    return(
      <div className="timerCard" style={timerCard}>{/* whole card area */}
        <div 
          className="toggleArea"
          onClick={()=>(this.props.handleChange(timer.id))}>
          <div className="pad">
            {/* Pad Area */}
          </div>
          <div className="titleArea"> {/* Title Area */}
            <h6>
              {timer.required && 
                <span className="reqSym">&#x203C;&#xFE0F;</span>
              }
              {timer.title}
            </h6>
            {timer.countdown !== undefined ?
              <span className="date">In {timer.countdown}</span>
            : timer.completed.length > 0 ?
              <span className="date">Last completed: {timer.completed[timer.completed.length-1].toDateString()}</span>
            :
              <span className="date"></span>
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
            <IconButton 
              aria-label={"Delete "+timer.title}
              onClick={()=>this.props.delete(timer.id,"timerCard")}>
              <Icon className="delete">delete_forever</Icon>
            </IconButton>
          }
        </div>
      </div>
    );
  }
}