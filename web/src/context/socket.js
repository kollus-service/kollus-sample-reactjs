import io from 'socket.io-client';
import * as config from "../config";

export const newSocket = io(config.SOCKET_URL);
