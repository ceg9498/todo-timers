import React from 'react';
import { IDialog } from '../data/schema';

/* MaterialUI's Dialog Compoents */
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

export default function DisplayDialog(props:IDialog){
  if(props.timer === undefined){
    return(<></>);
  }
  let { closeDialog, isOpen, timer, deleteItem } = props;
  return(
    <Dialog 
      onClose={closeDialog}
      aria-labelledby="dialog-title"
      open={isOpen}>
        <DialogTitle id="dialog-title">
          {timer.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {timer.category}
          </DialogContentText>
          <DialogContentText>
            {timer.description}
          </DialogContentText>
          <DialogContentText>
            {timer.completed.length > 0 &&
              "Last completion: " +
              timer.completed[timer.completed.length-1].toLocaleString()
            }
            <br/>
            {timer.isCompleted &&
              "Next reset time: " +
              timer.resetTime.toLocaleString()
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>
            Close
          </Button>
          <Button onClick={()=>deleteItem(props.timer.id,"dialog")}>
            Delete
          </Button>
        </DialogActions>
    </Dialog>
  );
}