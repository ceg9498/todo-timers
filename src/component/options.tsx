import React, { useState } from 'react';

import { deleteAll } from '../data/data';
import DisplaySnack from './DisplaySnack';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
/* MaterialUI's Dialog Compoents */
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

interface IOptionsProps {
  setOptions:Function,
  optionsState:IOptionsState
}

interface IOptionsState {
  hideCompleted:boolean,
  viewSlim:boolean
}

export default function Options(props:IOptionsProps){
  let { setOptions, optionsState } = props;
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isSnackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  return (
    <>
      <FormControlLabel control={
        <Switch 
          checked={optionsState.hideCompleted} 
          onChange={(e)=>setOptions(e,"hideCompleted")} />
      } label="Hide Completed" />
      <br/>
      <FormControlLabel control={
        <Switch 
          checked={optionsState.viewSlim} 
          onChange={(e)=>setOptions(e,"viewSlim")} />
      } label="Slim Timers" />
      <br/><br/>
      <Button onClick={()=>setDeleteOpen(true)}>
        Delete my data
      </Button>
      <DeleteConf isOpen={isDeleteOpen} close={setDeleteOpen} setSnack={setSnackOpen} snackMsg={setSnackMsg} />
      <DisplaySnack isSnackOpen={isSnackOpen} closeSnack={setSnackOpen} message={snackMsg} />
    </>
  );
}


function DeleteConf(props:{isOpen:boolean, close:any, setSnack:any, snackMsg:any}){
  let {isOpen, close, setSnack, snackMsg} = props;
  
  return(
    <Dialog 
      onClose={()=>close(false)}
      aria-labelledby="dialog-title"
      open={isOpen}>
      <DialogTitle id="dialog-title">
        Delete?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete your data? This action cannot be undone!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>close(false)}>
          Cancel
        </Button>
        <Button onClick={()=>deleteHandler(close, setSnack, snackMsg)}>
          Yes, delete it
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function deleteHandler(close:any, setSnack:any, snackMsg:any){
  // start by closing the dialog box
  close(false);
  // then call delete all to clear IndexedDB
  deleteAll().then((message)=>{
    snackMsg(message);
    setSnack(true);
  });
}