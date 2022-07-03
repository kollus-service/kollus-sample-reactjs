import React, { useState } from "react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function PositionedSnackbar(porps) {
  const [state, setState] = useState({
    vertical: 'bottom',
    horizontal: 'right',
  });

  const { vertical, horizontal} = state;

  return (
    <div>
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={porps.alertOpen} autoHideDuration={3000} onClose={porps.closeMessage}>
        <Alert onClose={porps.closeMessage} severity="success" sx={{ width: '100%' }}>
          Received LMS message!<br/>
          hash : {porps.message.hash}
        </Alert>
      </Snackbar>
    </div>
  );
}