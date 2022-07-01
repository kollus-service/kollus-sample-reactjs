import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isMobile } from 'react-device-detect';
import Container from '@mui/material/Container';

import Content from './components/Template/Content'
import Template from './components/Template/Template'
import * as config from './config';
import useDidMountEffect from './hoc/useDidMountEffect';

export default function App() {
  const [playInfo, setPlayInfo] = useState({
    jwt : null,
    customKey : null,
  })
  const [mckey, setMckey] = useState(config.DEFAULT_MCKEY)
  const [content, setContent] = useState(null);
  const [contentDownload, setContentDownload] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedContentTitle, setSelectedContentTitle] = useState("Upload");

  const getPlayInfo = async(isRefresh, userMckey) => {
    let response;

    if (isRefresh) {
      setPlayInfo({jwt : null, customKey : null});
    }
    
    if (userMckey) {
      setMckey(userMckey);
    }

    // axios call 은 한번만
    if(playInfo.customKey == null || playInfo.jwt == null) {
      response = await axios.get( config.BASE_URL+"/contents/play?mckey=" + mckey);
      console.log(response);
      setPlayInfo(prevState => {
        return {
          ...prevState,
          jwt : response.data.jwt,
          customKey : response.data.customKey,
        }
      });
    }
    
    setContent(config.VG_URL+'/s?jwt='+playInfo.jwt+'&custom_key='+playInfo.customKey+'&loadcheck=0');
    setContentDownload(config.KOLLUS_DOWNLOAD+'?url='+config.VG_URL+'/si?jwt='+playInfo.jwt+'&custom_key='+playInfo.customKey+'&loadcheck=0');
  };

  const downloadFile = () => {
    document.location.href = contentDownload;
  }

  const uploadFile = async (event) => {
    let formData = new FormData();
    formData.append("upload-file", selectedContent);

    const uploadUrlInfo = await axios.get(config.BASE_URL+"/contents/upload/url");
    // console.log(uploadUrlInfo.data.result.upload_url);
    let uploadUrl = uploadUrlInfo.data.result.upload_url;

    try {
      const response = await axios({
        method: "post",
        url: uploadUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      alert(response.data.message);
    } catch(error) {
      console.log(error)
    }
  }

  const uploadFileSelect = (event) => {
    if(event.target.files.length > 0) {
      setSelectedContentTitle(event.target.files[0].name);
      setSelectedContent(event.target.files[0])
    } else {
      setSelectedContentTitle("Upload");
      setSelectedContent(null)
    }
  }

  useEffect(() => {
    getPlayInfo();
  }, [content]);

  // Mount 완료 후 동작
  useDidMountEffect(() => {
  }, []);

  let main = <Content getPlayInfo={getPlayInfo} downloadFile={downloadFile} isMobile={isMobile} content={content}/>;

  return (
    <Container>
      <Template title={config.DEFAULT_TITLE} main={main} uploadFile={uploadFile} uploadFileSelect={uploadFileSelect} selectedContentTitle={selectedContentTitle} />
    </Container>
  );
}
