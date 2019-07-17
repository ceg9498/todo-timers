import React, { Component } from 'react'

interface ITimer {
    index: number,
    name: string,
    frequency: string,
    required: boolean,
    completed: Date[],
    handleChange: any,
}

export default class Timer extends Component<ITimer,any> {
    constructor(props:ITimer){
        super(props);
        this.state = {
            isDone: this.isChecked(),
        };
    }
    componentDidMount(){
        
    }

    handleChange = (e:React.FormEvent<EventTarget>) => {
        let target = e.target as HTMLInputElement;
        this.props.handleChange(e,this.props.index);
        this.setState({
            isDone: target.checked,
        });
    }

    isChecked(){
        // check if the array is empty
        if(!this.props.completed){
            return false;
        }
        // check if last date on list is greater than the last reset for the period
        if(this.props.completed[this.props.completed.length-1] > this.getReset()){
            return true;
        } else {
            return false;
        }
    }

    getReset(){
        let reset = new Date();
        if(this.props.frequency === "day"){
            reset.setUTCHours(15);
        } else if(this.props.frequency === "week"){
            // Tuesday @ 8am UTC
            // Need to figure out how to change the date itself
        } else {
            // Based on the text in this.props.frequency
            // Need to figure out how I want to store the data
        }
        reset.setUTCMinutes(0);
        reset.setUTCSeconds(0);
        reset.setUTCMilliseconds(0);
        return reset;
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
                name={"isDone"} 
                checked={this.state.isDone} 
                onChange={this.handleChange} />
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