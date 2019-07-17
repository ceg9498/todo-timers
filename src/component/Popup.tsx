import React, { Component } from 'react';
import './popup.scss'

export default class Popup extends Component<any,any> {
    constructor(props){
     super(props);
     this.state = { isOpen:false };
    }
    
    Open = () => {
     this.setState({
      isOpen: true,
     })
    }
    Close = () => {
     this.setState({
      isOpen: false,
     })
    }
    
    render(){
        let isOpen = this.state.isOpen;
        let title = this.props.title;
        let content = this.props.children;
     
     return (
      <div>
       <span onClick={this.Open} className="PopupLabel">{title}</span>
       { isOpen && 
        <div className="popup">
   <div className="close" onClick={this.Close}>✘
    </div>
        {content}
        </div>
       }
      </div>
     );
    }
   }

   /*
   Component example:
   <Popup title="A Popup">Testing this popup...</Popup>
   */