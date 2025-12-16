import app from "./app.js"
import { createServer } from "http"
import { Server } from "socket.io"

const server = createServer(app)
const io = new Server(server,{
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("User connected with Id : ", socket.id)

    socket.on("sendMessage", ({userId, image, username, msg}) => {
        io.emit("receiveMessage",{userId, image, username, msg})
    })

    
})

export default server;