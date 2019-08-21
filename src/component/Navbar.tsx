import React from 'react'
import './navbar.scss'

export default function Navbar(props){
    return (
        <nav id="navbar">
            <ul role="navigation">
            <li>
            <a href="#top" id="a-top">XIV Timers</a>
            </li><li>
            <a href="#day">Daily</a>
            </li><li>
            <a href="#week">Weekly</a>
            </li><li>
            <a href="#other">Other</a>
            </li>
            </ul>
            {props.reset &&
                <span>Daily Reset {props.reset.day}</span>
            }
        </nav>
   );
}