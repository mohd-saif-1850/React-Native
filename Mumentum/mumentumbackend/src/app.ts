import express from "express"
import cors from "cors"
import { generalRateLimit } from "./utils/rateLimit"
import helmet from "helmet"

const app = express()

app.use(express.json())
app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}))

app.get("/",(req,res) => {
  res.send(`Mumentum Backend is Running !`)
})

// Rate Limiting
app.use(generalRateLimit)
// Routes Configuration
import userRoutes from "./routes/user.route"
import taskRoutes from "./routes/todo.route"
import challengeRoutes from "./routes/challenge.route"

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/task",taskRoutes)
app.use("/api/v1/challenge",challengeRoutes)

// Auto Deletion
import { autoDeleteUsers, deactivateExpiredTasks, expiredChallenge } from "./helpers/autoDeletion"


setInterval(expiredChallenge,5 * 60 * 1000)
setInterval(deactivateExpiredTasks,60 * 60 * 1000)
setInterval(autoDeleteUsers,6 * 60 * 60 * 1000)

export default app;