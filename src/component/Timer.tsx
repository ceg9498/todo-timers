import React, { Component } from 'react'
import './timer.scss'

interface ITimer {
    id: number,
    title: string,
    frequency: string,
    required: boolean,
    completed: Date[],
    handleChange: any,
    isCompleted: boolean,
}

export default class Timer extends Component<ITimer,any> {
    constructor(props:ITimer){
        super(props);
        this.state = {};
    }
    
    render(){
     return(
      <div className="timerBox">
        <input 
            type="checkbox" 
            name="isCompleted" 
            id={this.props.title}
            checked={this.props.isCompleted} 
            onChange={e => (this.props.handleChange(e, this.props.id))} />
        <label htmlFor={this.props.title} className="timerTile">
            {this.props.required && 
            	<span className="reqSym">&#x203C;&#xFE0F;</span>
            }
            <span>{this.props.title}</span><br/>
            
                {this.props.completed.length > 0 ?
                    <span className="date">Last completed on: {this.props.completed[this.props.completed.length-1].toDateString()}</span>
                :
                    <span className="date"></span>
                }
        </label>
      </div>
     );
    }
}