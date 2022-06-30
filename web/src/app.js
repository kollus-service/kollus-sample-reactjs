import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isMobile } from 'react-device-detect';
import Container from '@mui/material/Container';

import Content from './components/Template/Content'
import Template from './components/Template/Template'
import * as config from './config';

export default function App() {
  const [playInfo, setPlayInfo] = useState({
    jwt : null,
    customKey : null,
  })

  const [content, setContent] = useState(null);

  const getPlayInfo = async() => {
    let response;

    response = await axios.get( config.BASE_URL+"/contents/play?mckey=" + config.DEFAULT_MCKEY);
    console.log(response);
    setPlayInfo(prevState => {
      return {
        ...prevState,
        jwt : response.data.jwt,
        customKey : response.data.customKey,
      }
    });
    
    setContent(config.VG_URL+'/s?jwt='+playInfo.jwt+'&custom_key='+playInfo.customKey+'&loadcheck=0');
  };

  // useEffect(() => {
  //   getPlayInfo();
  // }, []);

  let main = <Content getPlayInfo={getPlayInfo} isMobile={isMobile} content={content}/>;

  return (
    <Container>
      <Template title={config.DEFAULT_TITLE} main={main} />
    </Container>
  );
}
