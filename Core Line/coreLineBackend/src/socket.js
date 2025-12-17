import app from "./app.js"
import { createServer } from "http"
import { Server } from "socket.io"
import { Chat } from "./models/chat.model.js"
import { Message } from "./models/message.model.js"

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-global", ({ userId, username, image }) => {
    socket.join("GLOBAL_CHAT")
    io.to("GLOBAL_CHAT").emit("user-joined-global", {
      userId,
      username,
      image
    })
  })

  socket.on("send-global-message", ({ userId, username, image, msg }) => {
    io.to("GLOBAL_CHAT").emit("receive-global-message", {
      userId,
      username,
      image,
      msg
    })
  })

  socket.on("typing-global", ({ username }) => {
    socket.to("GLOBAL_CHAT").emit("typing-global", { username })
  })

  socket.on("stop-typing-global", ({ username }) => {
    socket.to("GLOBAL_CHAT").emit("stop-typing-global", { username })
  })

  socket.on("join-chat", async ({ chatId, userId }) => {
    const chat = await Chat.findById(chatId)
    if (!chat) return

    const allowed = chat.participants.some(
      (id) => id.toString() === userId
    )
    if (!allowed) return

    socket.join(chatId)
  })

  socket.on("typing-1-1", ({ chatId, username }) => {
    socket.to(chatId).emit("typing-1-1", { username })
  })

  socket.on("stop-typing-1-1", ({ chatId, username }) => {
    socket.to(chatId).emit("stop-typing-1-1", { username })
  })

  socket.on("send-1-1-message", async ({ chatId, senderId, text }) => {
    const message = await Message.create({
      chatId,
      senderId,
      text
    })

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    })

    io.to(chatId).emit("receive-1-1-message", message)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

export default server
