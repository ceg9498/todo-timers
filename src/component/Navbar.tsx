import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function Navbar(props){
  return (
    <AppBar position="static">
      <Tabs value={props.value} onChange={props.handleTabChange} role="navigation">
        <Tab label="All Timers" id="a-top" />
        <Tab label="Required" />
        <Tab label="Scheduled" />
        <Tab label="Repeating" />
        <Tab label="Add Timer" />
        <Tab label="Options" />
      </Tabs>
    </AppBar>
  );
}