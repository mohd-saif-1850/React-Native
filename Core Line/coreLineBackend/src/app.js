import express from "express"

const app = express()

app.use(express.json())

app.get("/",(req,res) => {
    res.send(`Core Line Server is Running Here !`)
})

import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import messageRoutes from "./routes/message.route.js"



app.use("/api/v1/user",userRoutes)
app.use("/api/v1/chat",chatRoutes)
app.use("/api/v1/message", messageRoutes)

export default app;