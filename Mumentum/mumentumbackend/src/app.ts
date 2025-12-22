import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}))

app.get("/",(req,res) => {
  res.send(`Mumentum Backend is Running !`)
})

// Routes Configuration
import userRoutes from "./routes/user.route"

app.use("/api/v1/user",userRoutes)

export default app;