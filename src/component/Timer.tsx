import React, { Component } from 'react'
import './timer.scss'

import Icon from '@material-ui/core/Icon';
import { Typography } from '@material-ui/core';

interface ITimer {
    id: number,
    title: string,
    frequency: string,
    required: boolean,
    completed: Date[],
    handleChange: Function,
    isCompleted: boolean,
    delete: Function
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
        let timerCard;
        if(this.props.isCompleted){
            timerCard = this.checkedCard;
        }
     return(
      <div className="timerCard" style={timerCard}>
          <div className="timerCardGrid">
        <input
            type="checkbox" 
            name="isCompleted" 
            id={this.props.title}
            checked={this.props.isCompleted} 
            onChange={e => (this.props.handleChange(e, this.props.id))} />
            <div className="pad"></div>
        <label htmlFor={this.props.title} className="timerTile">
            {this.props.required && 
            	<span className="reqSym">&#x203C;&#xFE0F;</span>
            }
            <span>{this.props.title}</span><br/>
            
                {this.props.completed.length > 0 ?
                    <span className="date">Last completed: {this.props.completed[this.props.completed.length-1].toDateString()}</span>
                :
                    <span className="date"></span>
                }
        </label>
        <Icon className="edit">edit</Icon>
        <Typography variant="srOnly">Edit {this.props.title}</Typography>
        <Icon className="delete" onClick={()=>this.props.delete(this.props.id)}>delete_forever</Icon>
        <Typography variant="srOnly">Delete {this.props.title} timer</Typography>
      </div></div>
     );
    }
}