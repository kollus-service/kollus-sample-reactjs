import React, {useState} from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Copyright from './Copyright'

export default function Content(props) {
  return (
    <div>
      {!props.mckey && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box component="div" display="flex" justifyContent="center" sx={{ width:640, height:480, border: '1px dashed grey', alignItems: 'center' }}>
            <p style={{fontWeight: 'bold'}}>Please Select a Video</p>
          </Box>
        </Box>
      )
      }

      {props.mckey && isMobile && (
        <MobileView>
          <iframe id="kollus-mobile-player" className="kollus-player" width="100%" height="480" src={props.content} frameBorder="0" allowFullScreen></iframe>
        </MobileView>
      )}
      
      {props.mckey && isBrowser && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <iframe id="kollus-player" className="kollus-player" onLoad={()=>{
            let controller = new VgControllerClient({
              //getElementById 값의 영상이 나올 iframe의 id값을 넣으시면 됩니다. 
              target_window: document.getElementById('kollus-player').contentWindow
            });

            controller.on('ready', function() {
              localStorage.setItem('player_id',controller.get_player_id())
            });
            }} width="640" height="480" src={props.content} frameBorder="0" allowFullScreen></iframe>
        </Box>
      )}
      <Grid style={{margin: "2rem 0"}} display="flex" justifyContent="center" alignItems="center" container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6} style={{textAlign:"end", padding:"0 1rem 0 0"}}>
        {props.mckey && (
          <Button variant="contained" color="neutral" onClick={() => {props.downloadFile()}}>Download</Button>
        )}
        </Grid>
        <Grid item xs={6} style={{padding:"0 0 0 1rem"}}>
        {props.mckey && (
          <Button variant="contained" color="neutral" onClick={() => {props.drmRefresh(); props.refresh(); props.getPlayInfo(); props.updateContentInfo();}}>Refresh</Button>
        )}
        </Grid>
      </Grid>
      <Copyright />
  </div>
  );
};