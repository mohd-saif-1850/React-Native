import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors({
    origin: [
        "*"
    ]
}))

app.get("/",(req,res) => {
    res.send("Backend for All is Running !")
})

//Routes Configuration
import mumentumRoutes from "./routes/mumentum.route.js"

app.use("/mumentum",mumentumRoutes)

export default app;