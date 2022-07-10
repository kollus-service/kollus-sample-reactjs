import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { isMobile } from "react-device-detect";
import * as config from "./config";
import * as hash from "./utils/hash"

import Container from "@mui/material/Container";
import Template from "./components/Template/Template";
import Content from "./components/Template/Content";
import LmsMessage from "./components/LmsMessage/LmsMessage";

export default function App() {
  const [playInfo, setPlayInfo] = useState({
    jwt: null,
    customKey: null,
  });
  const [contentInfo, setContentInfo] = useState({
    play: null,
    download: null,
  });
  const [selectedContent, setSelectedContent] = useState({
    selected: null,
    title: "Upload",
  });
  const [contentsList, setContentsList] = useState({
    data: [],
    state: null,
  });
  const [mckey, setMckey] = useState(null);

  const [userKey, setUserKey] = useState(hash.randomStr());

  const refresh = () => {
    setPlayInfo({ jwt: null, customKey: null });
  };

  const initialMcKey = (userMckey) => {
    setMckey(userMckey);
  };

  const getPlayInfo = async () => {
    if (playInfo.jwt == null || playInfo.customKey == null) {
      const response = await axios.get(
        config.BASE_URL + "/content/play?mckey=" + mckey
      );
      // console.log(response);
      setPlayInfo((prevState) => {
        return {
          ...prevState,
          jwt: response.data.jwt,
          customKey: response.data.customKey,
        };
      });
    }
  };

  const updateContentInfo = () => {
    if (mckey == null) return;

    setContentInfo((prevState) => {
      return {
        ...prevState,
        play:
          config.VG_URL + "/s?jwt=" + playInfo.jwt + "&custom_key=" + playInfo.customKey + "&loadcheck=0&s=0&uservalue0=" + userKey,
        download:
          config.KOLLUS_DOWNLOAD + "?url=" + config.VG_URL + "/si?jwt=" + playInfo.jwt + "&custom_key=" + playInfo.customKey + "&loadcheck=0",
      };
    });
  };

  const refreshContentsList = () => {
    setContentsList({ data: [], state: false });
  };
  
  const getContentsList = async (isRefresh) => {
    if (contentsList.state == false) {
      const response = await axios.get(config.BASE_URL + "/content/list");
      setContentsList((prevState) => {
        return {
          ...prevState,
          data: response.data,
          state: true,
        };
      });
    }
  };

  const drmRefresh = async () => {
    const response = await axios.get(config.BASE_URL + "/content/drm/refresh");
    console.log(response);
  };

  const downloadFile = () => {
    document.location.href = contentInfo.download;
  };

  const uploadFile = async (event) => {
    let formData = new FormData();
    formData.append("upload-file", selectedContent.selected);

    const uploadUrlInfoResponse = await axios.get(
      config.BASE_URL + "/content/upload/url"
    );
    // console.log(uploadUrlInfoResponse);

    const uploadUrlInfo = uploadUrlInfoResponse.data.result;

    try {
      const uploadResponse = await axios({
        method: "post",
        url: uploadUrlInfo.upload_url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log(uploadResponse);
      alert(uploadResponse.data.message);
      // uploadFileCheck(uploadUrlInfo.progress_url);
    } catch (error) {
      console.log(error);
    }
    
  };

  // const uploadFileCheck = (progress_url) => {
  //   const id = setInterval(async() => {
  //     const progressResponse = await axios.get(
  //       progress_url
  //     );

  //     console.log(progressResponse.data.result.progress);
  //     if (progressResponse.data.result.progress == 100) {
  //       clearInterval(id);
  //     }
  //   }, 1000);
  // }

  const uploadFileSelect = (event) => {
    if (event.target.files.length > 0) {
      setSelectedContent((prevState) => {
        return {
          ...prevState,
          selected: event.target.files[0],
          title: event.target.files[0].name,
        };
      });
    } else {
      setSelectedContent({
        selected: null,
        title: "Upload",
      });
    }
  };

  useEffect(() => {
    getPlayInfo();
    updateContentInfo();
    return () => {};
  }, [playInfo.jwt]);

  useLayoutEffect(() => {
    getContentsList();
    return () => {};
  }, [contentsList.state]);

  let main = (
    <Content
      mckey={mckey}
      getPlayInfo={getPlayInfo}
      downloadFile={downloadFile}
      isMobile={isMobile}
      content={contentInfo.play}
      updateContentInfo={updateContentInfo}
      drmRefresh={drmRefresh}
    />
  );

  return (
    <Container>
      <Template
        title={config.DEFAULT_TITLE}
        main={main}
        uploadFile={uploadFile}
        uploadFileSelect={uploadFileSelect}
        selectedContentTitle={selectedContent.title}
        getContentsList={getContentsList}
        refresh={refresh}
        refreshContentsList={refreshContentsList}
        getPlayInfo={getPlayInfo}
        updateContentInfo={updateContentInfo}
        initialMcKey={initialMcKey}
        contentsList={contentsList}
      />
      <LmsMessage userKey={userKey} />
    </Container>
  );
}
