import React, { useState } from 'react';

import { deleteAll } from '../data/data';
import Cookies from 'js-cookie';

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
  optionsState:IOptionsState,
  clearData:Function,
  openSnack:Function
}

interface IOptionsState {
  hideCompleted:boolean,
  viewSlim:boolean
}

export default function Options(props:IOptionsProps){
  let { setOptions, optionsState, openSnack } = props;
  const [isDeleteOpen, setDeleteOpen] = useState(false);

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
      <DeleteConf 
        isOpen={isDeleteOpen} 
        close={setDeleteOpen} 
        openSnack={openSnack} 
        clearData={props.clearData} />
    </>
  );
}


function DeleteConf(props:{isOpen:boolean, close:any, openSnack:any, clearData:any}){
  let {isOpen, close, openSnack, clearData} = props;
  
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
        <Button onClick={()=>deleteHandler(close, openSnack, clearData)}>
          Yes, delete it
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function deleteHandler(close:any, openSnack:any,clearData:any){
  // start by closing the dialog box
  close(false);
  // then call delete all to clear IndexedDB
  deleteAll().then((message)=>{
    openSnack(message);
  });
  // delete cookies as well
  Cookies.remove('isUser', { path: '' });
  clearData();
}