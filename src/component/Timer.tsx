import React, { Component } from 'react'

interface ITimer {
    name: string,
    frequency: string,
    required: boolean,
    completed: Date[],
}
interface ITimerS {
    name: string,
    frequency: string,
    required: boolean,
    completed: Date[],
    isChecked: boolean,
}

export default class Timer extends Component<ITimer,ITimerS> {
    constructor(props:ITimer){
        super(props);
        this.state = {
            name: props.name,
            frequency: props.frequency,
            required: props.required,
            completed: props.completed,
            isChecked: false,
        };
    }
    componentDidMount(){}

    handleChange = (e:React.FormEvent<EventTarget>) => {
        let target = e.target as HTMLInputElement;
        let dates = [];

        // if dates exist in the completion list, set them to the temporary array
        if(this.state.completed){
            this.state.completed.forEach(date => {
                dates.push(date);
            });
        }
        // if the box is being checked, add the current date onto the end of the array
        if(target.checked === true){
            dates.push(new Date());
        } else {
        // if the box is being unchecked, remove the last date from the end of the array
            dates.pop();
        }
        this.setState({
            isChecked: target.checked,
            completed: dates,
        });
    }

    displayDate(){
        let index = this.state.completed.length-1;
        let date = this.state.completed[index].getDate();
        let day = "";
        let month = "";
        let year = this.state.completed[index].getFullYear();

        switch (this.state.completed[index].getDay()){
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
        switch (this.state.completed[index].getMonth()){
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
                name={"isChecked"} 
                checked={this.state.isChecked} 
                onChange={this.handleChange} />
            {this.state.required && 
            	<span className="reqSym">&#x203C;&#xFE0F;</span>
            }
            {this.props.name}
        </label><br/>
        {this.state.completed && this.state.completed.length > 0 && 
            this.displayDate()
        }
      </div>
     );
    }
}