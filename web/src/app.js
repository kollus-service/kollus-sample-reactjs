import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { io } from "socket.io-client";
import { isMobile } from "react-device-detect";
import Container from "@mui/material/Container";

import Content from "./components/Template/Content";
import Template from "./components/Template/Template";
import * as config from "./config";
import useDidMountEffect from "./hoc/useDidMountEffect";

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
  const [mckey, setMckey] = useState(config.DEFAULT_MCKEY);

  const refresh = () => {
      setPlayInfo({ jwt: null, customKey: null });
  }

  const initialMcKey = (userMckey) => {
    setMckey(userMckey);
  }

  const getPlayInfo = async () => {
    if(playInfo.jwt == null || playInfo.customKey == null) {
      const response = await axios.get(
        config.BASE_URL + "/content/play?mckey=" + mckey
      );
      console.log(response);
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
    setContentInfo((prevState) => {
      return {
        ...prevState,
        play:
          config.VG_URL + "/s?jwt=" + playInfo.jwt + "&custom_key=" + playInfo.customKey + "&loadcheck=0",
        download:
          config.KOLLUS_DOWNLOAD + "?url=" + config.VG_URL + "/si?jwt=" + playInfo.jwt + "&custom_key=" + playInfo.customKey + "&loadcheck=0",
      };
    });
  }

  const refreshContentsList = () => {
    setContentsList({ data : [], state : false, });
  }
  const getContentsList = async (isRefresh) => {
    if(contentsList.state == false) {
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

  const downloadFile = () => {
    document.location.href = contentInfo.download;
  };

  const uploadFile = async (event) => {
    let formData = new FormData();
    formData.append("upload-file", selectedContent.selected);

    const uploadUrlInfo = await axios.get(
      config.BASE_URL + "/content/upload/url"
    );
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
    } catch (error) {
      console.log(error);
    }
  };

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

//   refresh
// initialMcKey
  let main = (
    <Content
      getPlayInfo={getPlayInfo}
      downloadFile={downloadFile}
      isMobile={isMobile}
      content={contentInfo.play}
      updateContentInfo={updateContentInfo}
      refresh={refresh}
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
    </Container>
  );
}
