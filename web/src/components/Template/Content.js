import React from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Copyright from './Copyright'

export default function Content(props) {
  return (
    <div>
      {props.isMobile ? (
        <MobileView>
          <iframe width="100%" height="480" src={props.content} frameBorder="0" allowFullScreen></iframe>
        </MobileView>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <iframe width="640" height="480" src={props.content} frameBorder="0" allowFullScreen></iframe>
        </Box>
      )}
      <Grid style={{margin: "2rem 0"}} display="flex" justifyContent="center" alignItems="center" container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6} style={{textAlign:"end", padding:"0 1rem 0 0"}}>
          <Button variant="contained" color="neutral" onClick={() => {props.downloadFile()}}>Download</Button>
        </Grid>
        <Grid item xs={6} style={{padding:"0 0 0 1rem"}}>
          <Button variant="contained" color="neutral"  onClick={() => props.getPlayInfo(true)}>Refresh</Button>
        </Grid>
      </Grid>
      <Copyright />
  </div>
  );
};