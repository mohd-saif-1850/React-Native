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

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

//Routes Configuration
import mumentumRoutes from "./routes/mumentum.route.js"

app.use("/mumentum",mumentumRoutes)

export default app;