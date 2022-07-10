import React, { useState, useEffect, useLayoutEffect, useCallback, } from "react";
import SnackBar from "../../components/Template/SnackBar";
import { newSocket } from "../../context/socket";

const LmsMessage = (props) => {
  const [socket, setSocket] = useState(newSocket);
  const [message, setMessage] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const openMessage = () => {
    setAlertOpen(true);
  };

  const closeMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const receivedMessage = useCallback((message) => {
    console.log(message);
    setMessage(message);
  }, []);

  useEffect(() => {
    socket.on("lms-callback-response/"+props.userKey, (e) => {
      openMessage(true);
      receivedMessage(e);
    });
    return () => {
      socket.off("lms-callback-response/"+props.userKey, (e) => {
        openMessage(true);
        receivedMessage(e);
      });
    };
  }, [socket]);

  return (
    <div>
      <SnackBar
        alertOpen={alertOpen}
        openMessage={openMessage}
        closeMessage={closeMessage}
        message={message}
      />
    </div>
  );
};

export default LmsMessage;