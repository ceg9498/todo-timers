import React, { Component } from 'react'

interface ITimer {
    id: any,
    name: string,
    frequency: string,
    required: boolean,
    completed: Date,
}
interface ITimerS {
    name: string,
    frequency: string,
    required: boolean,
    completed: Date,
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
        console.log("handleChange")
        let target = e.target as HTMLInputElement;
        this.setState({
            isChecked: target.checked,
        })
        if(target.checked){
            console.log("Checked!")
            this.setState({
                completed: new Date(),
            })
        } else {
            console.log("Unchecked!")
        }
        e.preventDefault();
    }

    displayDate(){
        let date = this.state.completed.getDate();
        let day = "";
        let month = "";
        let year = this.state.completed.getFullYear();

        switch (this.state.completed.getDay()){
            case 0:
                day = "Sunday";
                break;
            case 1:
                day = "Monday";
                break;
            case 2:
                day = "Tuesday";
                break;
            case 3:
                day = "Wednesday";
                break;
            case 4:
                day = "Thursday";
                break;
            case 5:
                day = "Friday";
                break;
            case 6:
                day = "Saturday";
                break;
        }
        switch (this.state.completed.getMonth()){
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
        console.log(new Date())
     return(
      <div className="timerTile" id={this.props.id}>
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
        {this.state.completed && 
            this.displayDate()
        }
      </div>
     );
    }
}