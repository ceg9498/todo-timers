import React from 'react'
import './navbar.scss'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function Navbar(props){
    return (
        <AppBar position="static">
            <Tabs value={props.value} onChange={props.handleTabChange} role="navigation">
                <Tab label="All Timers" id="a-top" />
                <Tab label="Required" />
                <Tab label="Daily" />
                <Tab label="Weekly" />
                <Tab label="Other" />
                <Tab label="Add Timer" />
            </Tabs>
        </AppBar>
   );
}