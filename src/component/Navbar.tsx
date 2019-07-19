import React from 'react'
import './navbar.scss'

export default function Navbar(){
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
   </nav>
   );
}