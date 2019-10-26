import React from 'react';
import { ISnack } from '../data/schema';

import Snackbar from '@material-ui/core/Snackbar';

export default function DisplaySnack(props:ISnack){
  let { isSnackOpen, message, closeSnack } = props;
  return(
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={isSnackOpen}
      autoHideDuration={6000}
      onClose={closeSnack}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{message}</span>}
    />
  );
}