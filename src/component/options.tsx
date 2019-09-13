import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

interface IOptionsProps {
  setOptions:Function,
  optionsState:IOptionsState
}

interface IOptionsState {
  hideCompleted:boolean
}

export default function Options(props:IOptionsProps){
  let { setOptions, optionsState } = props;
  return (
    <FormControlLabel control={
      <Switch checked={optionsState.hideCompleted} onChange={(e)=>setOptions(e,"hideCompleted")} />
    } label="Hide Completed" />
  );
}