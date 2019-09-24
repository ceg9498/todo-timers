import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';

export default function Navbar(props){
  return (
    <AppBar position="static">
      <Tabs value={props.value} 
        onChange={props.handleTabChange} 
        role="navigation">
        <Tab label="All Timers" icon={<Icon>access_time</Icon>} />
        <Tab label="Add Timer" icon={<Icon>add</Icon>} />
        <Tab label="Settings" icon={<Icon>settings</Icon>} />
      </Tabs>
    </AppBar>
  );
}