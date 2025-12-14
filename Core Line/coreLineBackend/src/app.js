import express from "express"

const app = express()

app.use(express.json())

app.get("/",(req,res) => {
    res.send(`Core Line Server is Running Here !`)
})

import userRoutes from "./routes/user.route.js"

app.use("/api/v1/user",userRoutes)

export default app;