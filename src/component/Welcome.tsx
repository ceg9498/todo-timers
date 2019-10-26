import React, { useState } from 'react';
/* MaterialUI's Dialog Compoents */
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

export default function Welcome(){
  const [isOpen, setOpen] = useState(true);
  return(
    <Dialog 
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title"
      open={isOpen}>
        <DialogTitle id="dialog-title">
          Welcome!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {welcomeText.p1}
          </DialogContentText>
          <DialogContentText>
            {welcomeText.p2}
          </DialogContentText>
          <DialogContentText>
            {welcomeText.p3}
          </DialogContentText>
          <DialogContentText>
            {welcomeText.p4}
          </DialogContentText>
          <DialogContentText>
            {welcomeText.p5}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>
            I Understand
          </Button>
        </DialogActions>
    </Dialog>
  );
}

const welcomeText = {
  p1: "Hello, and welcome to the To-Do app made specifically for repeating tasks! Before you get started, I'd like to tell you a bit about how your data is saved.",
  p2: "Any data that you put into this app - task names, dates, times, and so on - is stored on your machine. The app's creator will never see it. If you wish to delete your data, you can do so under the 'Settings' tab.",
  p3: "There are, however, some drawbacks to this! This app will only work with one device; you won't be able to view the information provided on one device while using the app on another device; if you use it on a shared device (such as a family computer, or one in a public location), others who use the device would be able to see your data. In addition, since the data is stored on your machine, it will take up some local space. I've done my best to keep the amount of space taken to be really small, but if you provide long descriptions or have a lot of timers, it might get a bit big.",
  p4: "If you decide not to provide any data, or choose to delete your data from the settings menu, nothing will be saved on your device.",
  p5: "Happy To-do-ing!"
}