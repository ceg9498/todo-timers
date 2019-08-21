import React, { Component } from 'react'
import './timer.scss'

interface ITimer {
    index: number,
    name: string,
    frequency: string,
    required: boolean,
    completed: Date[],
    handleChange: any,
    isDone: boolean,
}

export default class Timer extends Component<ITimer,any> {
    constructor(props:ITimer){
        super(props);
        this.state = {};
    }
    
    render(){
     return(
      <div>
        <input 
            type="checkbox" 
            name="isDone" 
            id={this.props.name}
            checked={this.props.isDone} 
            onChange={e => (this.props.handleChange(e, this.props.index))} />
        <label htmlFor={this.props.name} className="timerTile">
            {this.props.required && 
            	<span className="reqSym">&#x203C;&#xFE0F;</span>
            }
            <span>{this.props.name}</span><br/>
            
                {this.props.completed && this.props.completed.length > 0 ?
                    <span className="date">Last completed on: {this.props.completed}</span>
                :
                    <span className="date"></span>
                }
        </label>
      </div>
     );
    }
}