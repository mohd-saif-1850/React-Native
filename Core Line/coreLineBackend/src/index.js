import dbConnect from "./helpers/dbConnect.js";
import server from "./socket.js";
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 5000

dbConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Server start failed", err)
  })