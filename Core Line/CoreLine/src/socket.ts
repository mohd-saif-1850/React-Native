import { io } from "socket.io-client";

const SOCKET_URL = "http://172.22.176.149:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export default socket;
