import dotenv from "dotenv"
dotenv.config()

import app from "./app"
import { dbConnect } from "./database/dbConnect"
import { registerSocketServer } from "./webSocket";
import http from "http"


dbConnect();
// app.listen(process.env.PORT, () => {
//     console.log("Your App is Running on the Port : ",process.env.PORT)
// })

//Web Socket Configuration Here !
const server = http.createServer(app)

registerSocketServer(server)

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`Web Socket Server is Listening on Port : ${PORT}`)
})