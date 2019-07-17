import React, { Component } from 'react'

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

    displayDate(){
        let index = this.props.completed.length-1;
        let date = this.props.completed[index].getDate();
        let day = "";
        let month = "";
        let year = this.props.completed[index].getFullYear();

        switch (this.props.completed[index].getDay()){
            case 0:
                day = "Sun,";
                break;
            case 1:
                day = "Mon,";
                break;
            case 2:
                day = "Tues,";
                break;
            case 3:
                day = "Wed,";
                break;
            case 4:
                day = "Thurs,";
                break;
            case 5:
                day = "Fri,";
                break;
            case 6:
                day = "Sat,";
                break;
        }
        switch (this.props.completed[index].getMonth()){
            case 0:
                month = "January";
                break;
            case 1:
                month = "February";
                break;
            case 2:
                month = "March";
                break;
            case 3:
                month = "April";
                break;
            case 4:
                month = "May";
                break;
            case 5:
                month = "June";
                break;
            case 6:
                month = "July";
                break;
            case 7:
                month = "August";
                break;
            case 8:
                month = "September";
                break;
            case 9:
                month = "October";
                break;
            case 10:
                month = "November";
                break;
            case 11:
                month = "December";
                break;
        }
        return(
            <span className="date">Last completed on: {day} {month} {date}, {year}</span>
        );
    }
    
    render(){
        
     return(
      <div className="timerTile">
        <label>
            <input 
                type="checkbox" 
                name="isDone" 
                checked={this.props.isDone} 
                onChange={e => (this.props.handleChange(e, this.props.index))} />
            {this.props.required && 
            	<span className="reqSym">&#x203C;&#xFE0F;</span>
            }
            <span>{this.props.name}</span>
        </label><br/>
        {this.props.completed && this.props.completed.length > 0 && 
            this.displayDate()
        }
      </div>
     );
    }
}