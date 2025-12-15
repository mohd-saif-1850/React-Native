import { io } from "socket.io-client"

const SOCKET_URL = "https://chat-plus-backend.onrender.com" as string

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
})

export default socket
