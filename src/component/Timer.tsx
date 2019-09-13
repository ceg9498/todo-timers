import React, { Component } from 'react';
import { TimerType } from '../data/schema';
import './timer.scss';

import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

interface ITimer {
  data: TimerType,
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
    let timerCard;
    if(!timer){
      return(<></>);
    }
    if(timer.isCompleted){
      timerCard = this.checkedCard;
    }
    return(
      <div className="timerCard" style={timerCard}>
        <div className="timerCardGrid">
          <input
            type="checkbox" 
            name="isCompleted" 
            id={timer.title}
            checked={timer.isCompleted} 
            onChange={e => (this.props.handleChange(e, timer.id))} />
            <div className="pad"></div>
          <label htmlFor={timer.title} className="timerTile">
            {timer.required && 
              <span className="reqSym">&#x203C;&#xFE0F;</span>
            }
            <span>{timer.title}</span><br/>
              {timer.completed.length > 0 ?
                <span className="date">Last completed: {timer.completed[timer.completed.length-1].toDateString()}</span>
              :
                <span className="date"></span>
              }
          </label>
          <Icon className="edit">edit</Icon>
          <Typography variant="srOnly">Edit {timer.title}</Typography>
          <Icon className="delete" onClick={()=>this.props.delete(timer.id)}>delete_forever</Icon>
          <Typography variant="srOnly">Delete {timer.title} timer</Typography>
        </div>
      </div>
    );
  }
}